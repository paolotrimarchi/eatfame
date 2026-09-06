import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Stripe calls this directly -- there's no logged-in user, so this route
// uses the service-role Supabase client instead of the normal RLS-scoped one.
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook: invalid signature', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.error('Stripe webhook: checkout.session.completed with no order_id in metadata');
        return NextResponse.json({ received: true });
      }

      const supabase = createAdminClient();
      const { data: order, error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error || !order) {
        console.error('Stripe webhook: failed to mark order paid', error);
        return NextResponse.json({ received: true });
      }

      // Best-effort confirmation email -- a failure here shouldn't make Stripe
      // retry the whole webhook (the payment itself already succeeded).
      try {
        const { data: items } = await supabase
          .from('order_items')
          .select('quantity, unit_price, dishes(name)')
          .eq('order_id', orderId);

        const { data: userRes } = await supabase.auth.admin.getUserById(order.user_id);
        const email = userRes?.user?.email;

        if (email && items) {
          await sendOrderConfirmationEmail({
            to: email,
            deliveryWeekStart: order.delivery_week_start,
            deliveryDay: order.delivery_day,
            items: items.map((it: any) => ({ name: it.dishes?.name ?? 'Dish', quantity: it.quantity, unitPrice: it.unit_price })),
            subtotal: order.subtotal,
            delivery: {
              fullName: order.delivery_full_name,
              addressLine1: order.delivery_address_line1,
              addressLine2: order.delivery_address_line2,
              postcode: order.delivery_postcode,
              city: order.delivery_city,
            },
            allergies: order.delivery_allergies ?? [],
          });
        }
      } catch (err) {
        console.error('Stripe webhook: failed to send order confirmation email', err);
      }
    } catch (err) {
      // Whatever this is, log it loudly and clearly instead of letting Next
      // turn it into a generic framework stack trace with no message.
      console.error('Stripe webhook: checkout.session.completed handling failed:', err);
      return NextResponse.json({ error: 'Webhook handler failed', detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
