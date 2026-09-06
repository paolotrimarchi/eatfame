// Pure basket logic, safe to import from both client components AND server
// code (like the checkout Server Action). Deliberately NOT marked 'use
// client' -- that directive turns a module into a client/server bundle
// boundary, and importing a 'use client' module's functions from server code
// (e.g. a Server Action) silently replaces them with broken stand-ins. That
// was the actual cause of "priceTier is not a function" during checkout.
//
// The only browser-only bits (localStorage, window) are guarded at runtime
// instead, since the components that call them are already 'use client'.

const KEY = 'fame_order_cart_v1';

export function getCart(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function setCart(cart: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('fame-cart-changed'));
}

export function addToCart(dishId: string, delta: number) {
  const cart = getCart();
  const next = (cart[dishId] || 0) + delta;
  if (next <= 0) delete cart[dishId];
  else cart[dishId] = next;
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart({});
}

export function cartCount(cart: Record<string, number>) {
  return Object.values(cart).reduce((sum, n) => sum + n, 0);
}

// price per dish drops as the basket grows: 2 dishes = price_at_2, 3 = price_at_3, 4+ = price_at_4
export function priceTier(count: number): 'price_at_2' | 'price_at_3' | 'price_at_4' {
  if (count >= 4) return 'price_at_4';
  if (count === 3) return 'price_at_3';
  return 'price_at_2';
}

// Same minimums as the old site's config.js.
export const MIN_DISHES = 2;
export const BEST_PRICE_AT = 4;
