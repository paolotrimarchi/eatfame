'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { priceTier } from '@/lib/cart';

type PlaceOrderInput = {
  cart: Record<string, number>; // dishId -> quantity
  deliveryWeekStart: string;    // ISO date, the Sunday
  deliveryDay: 'sun' | 'mon';
};

type PlaceOrderResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; message: string };

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function placeOrder({ cart, deliveryWeekStart, deliveryDay }: PlaceOrderInput): Promise<PlaceOrderResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, message: 'Payments aren\'t configured yet (missing STRIPE_SECRET_KEY).' };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'You need to log in first.' };

  // Delivery address is snapshotted onto the order at the moment it's
  // placed, not read from the profile later -- so a later address edit
  // never rewrites where a past order was actually sent.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, address_line1, address_line2, postcode, city, allergies')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile || !profile.full_name || !profile.address_line1 || !profile.postcode) {
    return { ok: false, message: 'Add a delivery address on your account first.' };
  }

  const dishIds = Object.keys(cart);
  if (dishIds.length === 0) return { ok: false, message: 'Your basket is empty.' };

  const { data: dishes, error: dishError } = await supabase
    .from('dishes')
    .select('id, name, price_at_2, price_at_3, price_at_4')
    .in('id', dishIds);

  if (dishError || !dishes) {
    console.error('placeOrder: failed reading dishes', dishError);
    return { ok: false, message: `Could not read the basket${dishError ? `: ${dishError.message}` : ''}.` };
  }

  const count = Object.values(cart).reduce((s, n) => s + n, 0);
  const tier = priceTier(count);

  let subtotal = 0;
  const items = dishes.map((d) => {
    const unitPrice = Number((d as any)[tier]);
    const quantity = cart[d.id];
    subtotal += unitPrice * quantity;
    return { dish_id: d.id, name: d.name as string, quantity, unit_price: unitPrice };
  });

  // Order row is created up front as unpaid -- Stripe redirects back here
  // whether the customer pays or abandons checkout, and the webhook is what
  // actually flips it to paid once the charge succeeds.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      delivery_week_start: deliveryWeekStart,
      delivery_day: deliveryDay,
      subtotal,
      delivery_full_name: profile.full_name,
      delivery_phone: profile.phone,
      delivery_address_line1: profile.address_line1,
      delivery_address_line2: profile.address_line2,
      delivery_postcode: profile.postcode,
      delivery_city: profile.city,
      delivery_allergies: profile.allergies ?? [],
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('placeOrder: failed inserting order', orderError);
    return { ok: false, message: `Could not place the order${orderError ? `: ${orderError.message}` : ''}.` };
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items.map((it) => ({ dish_id: it.dish_id, quantity: it.quantity, unit_price: it.unit_price, order_id: order.id })));

  if (itemsError) {
    console.error('placeOrder: failed inserting order_items', itemsError);
    return { ok: false, message: `Order created, but items failed to save: ${itemsError.message}` };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      line_items: items.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(it.unit_price * 100),
          product_data: { name: it.name },
        },
      })),
      metadata: { order_id: order.id },
      success_url: `${siteUrl}/orders?paid=1`,
      cancel_url: `${siteUrl}/cart`,
    });

    if (!session.url) return { ok: false, message: 'Stripe did not return a checkout link.' };

    await supabase.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.id);

    return { ok: true, checkoutUrl: session.url };
  } catch (err) {
    console.error('placeOrder: Stripe session creation failed', err);
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `Could not start checkout: ${detail}` };
  }
}
