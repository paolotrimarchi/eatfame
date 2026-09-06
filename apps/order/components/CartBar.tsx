'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getCart, cartCount, priceTier } from '@/lib/cart';

// Floating "view my week" bar, visible on restaurant/dish pages once the
// basket has anything in it. Same idea as the old site's sticky cart bar.
export default function CartBar() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    function refresh() {
      const c = getCart();
      setCart(c);
      const ids = Object.keys(c);
      if (ids.length === 0) { setSubtotal(0); return; }

      const supabase = createClient();
      supabase.from('dishes').select('id, price_at_2, price_at_3, price_at_4').in('id', ids).then(({ data }) => {
        if (!data) return;
        const tier = priceTier(cartCount(c));
        const sum = data.reduce((s, d: any) => s + Number(d[tier]) * (c[d.id] || 0), 0);
        setSubtotal(sum);
      });
    }
    refresh();
    window.addEventListener('fame-cart-changed', refresh);
    return () => window.removeEventListener('fame-cart-changed', refresh);
  }, []);

  const count = cartCount(cart);
  if (count === 0) return null;

  return (
    <div className="cartbar">
      <Link href="/cart" className="btn">
        <span className="cb-n">{count}</span>
        <span>View my week</span>
        <span className="cb-t">€{subtotal.toFixed(2)}</span>
      </Link>
    </div>
  );
}
