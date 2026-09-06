'use client';

import { useRouter } from 'next/navigation';
import { setCart } from '@/lib/cart';
import { euro } from '@/lib/format';

// Only rendered when the user actually has a previous order -- a new customer
// never sees this. For anyone who's ordered before, this is the shortest path
// to the thing they most likely want: last week again, tweak from there.
export default function RepeatLastOrder({
  items,
  total,
}: {
  items: { dish_id: string; quantity: number; name: string }[];
  total: number;
}) {
  const router = useRouter();

  function repeat() {
    const cart: Record<string, number> = {};
    for (const it of items) cart[it.dish_id] = it.quantity;
    setCart(cart);
    router.push('/cart');
  }

  const summary = items.map((it) => `${it.quantity}× ${it.name}`).join(', ');

  // No page padding of its own -- the caller decides whether it sits inside a
  // .wrap (Orders) or needs one (Home).
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div className="sub-h" style={{ margin: '0 0 6px' }}>Order again</div>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="muted" style={{ fontSize: 13 }}>Was {euro(total)}</span>
        <button className="btn btn-sm" onClick={repeat}>Repeat this</button>
      </div>
    </div>
  );
}
