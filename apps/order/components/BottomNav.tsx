'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartCount } from '@/lib/useCartCount';

// Tab bar for the "home base" pages. Restaurant/dish/cart pages replace this
// with a floating cart bar + a small back button instead -- the cart screen in
// particular needs the bottom slot for its own pay button.
const TAB_PAGES = ['/', '/orders', '/account'];

export default function BottomNav() {
  const pathname = usePathname();
  const count = useCartCount();
  if (!TAB_PAGES.includes(pathname)) return null;

  return (
    <nav className="bottomnav">
      <Link href="/" className={`bottomnav-item ${pathname === '/' ? 'active' : ''}`}>
        <HomeIcon />
        <span>Home</span>
      </Link>
      {/* Without this, a basket built on a restaurant page becomes unreachable
          the moment you navigate Home -- the floating cart bar doesn't render
          here, so there was no route back to it at all. */}
      <Link href="/cart" className="bottomnav-item">
        <span className="bn-icon">
          <BasketIcon />
          {count > 0 && <span className="bn-badge">{count}</span>}
        </span>
        <span>Basket</span>
      </Link>
      <Link href="/orders" className={`bottomnav-item ${pathname === '/orders' ? 'active' : ''}`}>
        <OrdersIcon />
        <span>Orders</span>
      </Link>
      <Link href="/account" className={`bottomnav-item ${pathname === '/account' ? 'active' : ''}`}>
        <UserIcon />
        <span>Account</span>
      </Link>
    </nav>
  );
}

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 8h14l-1.2 11a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" strokeLinecap="round" />
    </svg>
  );
}
