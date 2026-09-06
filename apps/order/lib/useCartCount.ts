'use client';

import { useEffect, useState } from 'react';
import { getCart, cartCount } from './cart';

// Total dishes across the whole basket (not just the current restaurant),
// kept in sync with any add/remove anywhere on the site.
export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(cartCount(getCart()));
    refresh();
    window.addEventListener('fame-cart-changed', refresh);
    return () => window.removeEventListener('fame-cart-changed', refresh);
  }, []);

  return count;
}
