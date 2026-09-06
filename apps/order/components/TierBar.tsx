'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCart, cartCount, priceTier, BEST_PRICE_AT, MIN_DISHES } from '@/lib/cart';
import { euro } from '@/lib/format';

type Priced = { id: string; price_at_2: number; price_at_3: number; price_at_4: number };

// The nudge under a restaurant's header. It used to just say "add 2 more
// dishes for the best price", which is the mechanic without the number that
// makes anyone act. Now it works out what those 2 dishes would actually save
// on the basket they already have.
export default function TierBar() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [dishes, setDishes] = useState<Priced[]>([]);

  useEffect(() => {
    async function refresh() {
      const c = getCart();
      setCart(c);
      const ids = Object.keys(c);
      if (ids.length === 0) { setDishes([]); return; }
      const supabase = createClient();
      const { data } = await supabase
        .from('dishes')
        .select('id, price_at_2, price_at_3, price_at_4')
        .in('id', ids);
      if (data) setDishes(data as Priced[]);
    }
    refresh();
    window.addEventListener('fame-cart-changed', refresh);
    return () => window.removeEventListener('fame-cart-changed', refresh);
  }, []);

  const count = cartCount(cart);
  const done = count >= BEST_PRICE_AT;

  if (done) {
    return <div className="tierbar done">✓ Best price applied to every dish</div>;
  }

  // Below the minimum, the useful thing to say is the minimum -- finding that
  // out from a disabled checkout button is a bad way to learn a rule.
  if (count < MIN_DISHES) {
    const need = MIN_DISHES - count;
    return (
      <div className="tierbar">
        {count === 0
          ? `Minimum ${MIN_DISHES} dishes per delivery · best price at ${BEST_PRICE_AT}+`
          : `Add ${need} more dish${need > 1 ? 'es' : ''} to reach the ${MIN_DISHES}-dish minimum`}
      </div>
    );
  }

  const need = BEST_PRICE_AT - count;
  const tier = priceTier(count);
  const now = dishes.reduce((s, d) => s + Number(d[tier]) * (cart[d.id] || 0), 0);
  const best = dishes.reduce((s, d) => s + Number(d.price_at_4) * (cart[d.id] || 0), 0);
  const saving = now - best;

  return (
    <div className="tierbar">
      {saving > 0.001
        ? `Add ${need} more dish${need > 1 ? 'es' : ''} and every dish drops to its best price — saves ${euro(saving)} on what's already in your basket`
        : `Add ${need} more dish${need > 1 ? 'es' : ''} for the best price on every dish`}
    </div>
  );
}
