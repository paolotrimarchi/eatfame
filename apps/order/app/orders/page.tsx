import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import RepeatLastOrder from '@/components/RepeatLastOrder';
import { euro, longDate, placedDate, orderRef } from '@/lib/format';
import type { Order, OrderItem } from '@/lib/types';

function Header() {
  return (
    <div style={{ padding: '28px 0 6px' }}>
      <div className="eyebrow">Fame</div>
      <h1 className="page-h" style={{ margin: '2px 0 0' }}>My orders</h1>
    </div>
  );
}

const FULFILMENT_LABEL: Record<Order['status'], string> = {
  placed: 'Being prepared',
  confirmed: 'Confirmed with the restaurant',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="wrap pad-bar">
        <Header />
        <p className="muted">Log in to see your orders.</p>
        <Link href="/login" className="btn" style={{ marginTop: 12 }}>Log in</Link>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Order[] | null };

  if (!orders || orders.length === 0) {
    return (
      <div className="wrap pad-bar">
        <Header />
        <div style={{ textAlign: 'center', padding: '20px 10px 8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/empty-plate.svg" alt="" width={180} height={148} style={{ margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, margin: '0 0 6px' }}>
            Nothing on order yet.
          </p>
          <p className="muted" style={{ margin: '0 0 20px' }}>
            Pick a few dishes and your week will show up here.
          </p>
          <Link href="/" className="btn">Browse restaurants</Link>
        </div>
      </div>
    );
  }

  const orderIds = orders.map((o) => o.id);
  const { data: items } = await supabase
    .from('order_items')
    .select('*, dishes(name, cooking_instructions)')
    .in('order_id', orderIds) as {
      data: (OrderItem & { dishes: { name: string; cooking_instructions: string | null } })[] | null
    };

  // Repeating the most recent paid order is the shortest path to the thing a
  // returning customer most likely wants, so it goes above the list.
  const lastPaid = orders.find((o) => o.payment_status === 'paid');
  const lastPaidItems = lastPaid ? (items ?? []).filter((it) => it.order_id === lastPaid.id) : [];

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="wrap pad-bar">
      <Header />

      {lastPaid && lastPaidItems.length > 0 && (
        <RepeatLastOrder
          items={lastPaidItems.map((it) => ({
            dish_id: it.dish_id,
            quantity: it.quantity,
            name: it.dishes?.name ?? 'Dish',
          }))}
          total={lastPaid.subtotal}
        />
      )}

      {orders.map((o) => {
        const orderItems = (items ?? []).filter((it) => it.order_id === o.id);
        const upcoming = o.delivery_week_start >= today && o.status !== 'cancelled';
        return (
          <div key={o.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
              <b>{longDate(o.delivery_week_start)}</b>
              <span
                className="chip"
                style={o.payment_status === 'paid' ? { background: 'var(--tint)', color: 'var(--green-500)' } : { background: '#fbeee0', color: '#8a5a1e' }}
              >
                {o.payment_status === 'paid' ? '✓ Paid' : 'Payment pending'}
              </span>
            </div>

            {/* Two orders for the same week used to be indistinguishable. */}
            <p className="muted" style={{ margin: '0 0 10px', fontSize: 12.5 }}>
              #{orderRef(o.id)} · ordered {placedDate(o.created_at)}
              {o.payment_status === 'paid' && ` · ${FULFILMENT_LABEL[o.status] ?? o.status}`}
            </p>

            {o.delivery_allergies && o.delivery_allergies.length > 0 && (
              <div style={{ background: '#fdeee0', border: '1px solid #f3d5b0', borderRadius: 10, padding: '8px 10px', marginBottom: 10, fontSize: 13, fontWeight: 650, color: '#8a5a1e' }}>
                ⚠ Allergies flagged: {o.delivery_allergies.join(', ')}
              </div>
            )}

            {orderItems.map((it) => (
              <div key={it.id} style={{ padding: '4px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{it.quantity}× {it.dishes?.name}</span>
                  <span>{euro(it.unit_price * it.quantity)}</span>
                </div>
                {/* Inline rather than a page trip -- heating is the whole
                    differentiator, it shouldn't cost a navigation. */}
                <details className="heat-details">
                  <summary>how to heat it</summary>
                  <p>
                    {it.dishes?.cooking_instructions ??
                      "Heating instructions for this dish are on their way — we'll include them with your delivery."}
                  </p>
                </details>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 700 }}>
              <span>Total</span>
              <span>{euro(o.subtotal)}</span>
            </div>

            {upcoming && (
              <p className="muted" style={{ margin: '12px 0 0', fontSize: 12.5 }}>
                Need to change or cancel? Free up to 48 hours before delivery —{' '}
                <a href={`mailto:hello@eatfame.com?subject=Order%20%23${orderRef(o.id)}`}>email us</a>.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
