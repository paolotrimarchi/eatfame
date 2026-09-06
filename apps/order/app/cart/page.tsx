'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getCart, addToCart, cartCount, priceTier, clearCart, MIN_DISHES, BEST_PRICE_AT } from '@/lib/cart';
import { weekOptions, dayDate, LEAD_DAYS } from '@/lib/weeks';
import { getSelectedWeek, setSelectedWeek, getSelectedDay, setSelectedDay, WEEK_CHANGED } from '@/lib/weekSelection';
import { euro, shortDate, dayMonth } from '@/lib/format';
import { imageUrl, hasDeliveryAddress } from '@/lib/types';
import { placeOrder } from './actions';
import InlineLogin from '@/components/InlineLogin';
import AddressForm from '@/components/AddressForm';
import BackButton from '@/components/BackButton';
import type { Dish, Profile } from '@/lib/types';

export default function CartPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [cart, setCartState] = useState<Record<string, number>>({});
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState<'sun' | 'mon'>('sun');
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');

  // Checkout has two gates before payment: logged in, then a delivery
  // address on file. Both render inline here instead of navigating away, so
  // the basket (and the week/day already picked) never gets lost mid-flow.
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshAuth = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setLoggedIn(!!user);
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      setProfile(data as Profile | null);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const c = getCart();
    setCartState(c);
    // Week/day were already chosen on Home -- carry that through rather than
    // asking again from scratch.
    setWeek(getSelectedWeek());
    setDay(getSelectedDay());

    const ids = Object.keys(c);
    if (ids.length === 0) {
      setLoadingDishes(false);
    } else {
      const supabase = createClient();
      supabase.from('dishes').select('*').in('id', ids).then(({ data }) => {
        if (data) setDishes(data as Dish[]);
        setLoadingDishes(false);
      });
    }

    const syncWeek = () => { setWeek(getSelectedWeek()); setDay(getSelectedDay()); };
    window.addEventListener(WEEK_CHANGED, syncWeek);
    refreshAuth();
    return () => window.removeEventListener(WEEK_CHANGED, syncWeek);
  }, [refreshAuth]);

  function bump(dishId: string, delta: number) {
    setCartState(addToCart(dishId, delta));
  }

  function pickWeek(i: number) {
    setWeek(i);
    setSelectedWeek(i);
  }

  function pickDay(d: 'sun' | 'mon') {
    setDay(d);
    setSelectedDay(d);
  }

  const count = cartCount(cart);
  const tier = priceTier(count);
  const subtotal = dishes.reduce((s, d) => s + Number(d[tier]) * (cart[d.id] || 0), 0);
  const subtotalFull = dishes.reduce((s, d) => s + Number(d.price_at_2) * (cart[d.id] || 0), 0);
  const bestTotal = dishes.reduce((s, d) => s + Number(d.price_at_4) * (cart[d.id] || 0), 0);
  const saving = subtotalFull - subtotal;
  const nextTierSaving = subtotal - bestTotal;
  const belowMin = count < MIN_DISHES;
  const needsAddress = authChecked && loggedIn && !hasDeliveryAddress(profile);
  const canPay = authChecked && loggedIn && !needsAddress;

  async function onCheckout() {
    setMessage('');
    try {
      setPlacing(true);
      const res = await placeOrder({
        cart,
        deliveryWeekStart: dayDate(week, 'sun'),
        deliveryDay: day,
      });
      if (res.ok) {
        // Basket is cleared now -- the order's already saved (unpaid) and
        // Stripe owns the rest of the flow. Full navigation, not router.push,
        // since checkoutUrl is on stripe.com, not this app.
        clearCart();
        window.location.href = res.checkoutUrl;
      } else {
        setMessage(res.message);
        setPlacing(false);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      const detail = err instanceof Error ? err.message : String(err);
      setMessage(`Something went wrong placing the order: ${detail}`);
      setPlacing(false);
    }
  }

  if (loadingDishes) {
    return (
      <div className="wrap" style={{ paddingTop: 20 }}>
        <BackButton fallback="/" />
        <h1 className="page-h">Your week</h1>
        <div className="clist">
          {[0, 1].map((i) => (
            <div key={i} className="citem">
              <div className="skeleton" style={{ width: 62, height: 62, borderRadius: 'var(--r-sm)' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: 90, height: 30 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="wrap" style={{ paddingTop: 24 }}>
        <BackButton fallback="/" />
        <h1 className="page-h">Your week</h1>
        <p className="muted">Your basket is empty.</p>
        <Link href="/" className="btn" style={{ marginTop: 12 }}>Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div className="wrap pad-bar" style={{ paddingTop: 20 }}>
      <BackButton fallback="/" />
      <h1 className="page-h">Your week</h1>

      <div className="clist">
        {dishes.map((d) => (
          <div key={d.id} className="citem">
            <div className="ph">
              {imageUrl(d.image_path) && <Image src={imageUrl(d.image_path)!} alt="" width={62} height={62} />}
            </div>
            <div>
              <h4>{d.name}</h4>
              <div className="qty inline">
                <button onClick={() => bump(d.id, -1)} aria-label="Remove one">−</button>
                <span className="n">{cart[d.id] || 0}</span>
                <button onClick={() => bump(d.id, 1)} aria-label="Add one">+</button>
              </div>
            </div>
            <div className="cprice">{euro(Number(d[tier]) * (cart[d.id] || 0))}</div>
          </div>
        ))}
      </div>

      <div className="totals">
        <div className="row"><span>{count} dish{count === 1 ? '' : 'es'}</span><span>{euro(subtotalFull)}</span></div>
        {saving > 0.001 && <div className="row" style={{ color: 'var(--green-500)', fontWeight: 620 }}><span>Bulk price</span><span>−{euro(saving)}</span></div>}
        <div className="row"><span>Delivery</span><span>Free</span></div>
        <div className="row big"><span>Total</span><span className="amt">{euro(subtotal)}</span></div>
      </div>

      {/* The tier nudge belongs here too -- this is where intent is highest,
          and it was only ever shown back on the restaurant pages. */}
      {count < BEST_PRICE_AT && nextTierSaving > 0.001 && (
        <div className="tierbar" style={{ marginTop: 12 }}>
          Add {BEST_PRICE_AT - count} more dish{BEST_PRICE_AT - count > 1 ? 'es' : ''} and this basket drops to {euro(bestTotal)} — saves {euro(nextTierSaving)}
        </div>
      )}

      <div className="sub-h">Delivery week</div>
      <div className="weekbar">
        {weekOptions().map((w) => (
          <button key={w.index} className={`wk ${week === w.index ? 'sel' : ''}`} onClick={() => pickWeek(w.index)}>
            <b>{shortDate(dayDate(w.index, 'sun')).split(' ')[0]}</b>
            <span>{w.label}</span>
          </button>
        ))}
      </div>
      <p className="muted" style={{ margin: '8px 0 0', fontSize: 12.5 }}>
        Orders close {LEAD_DAYS} days before the delivery date.
      </p>

      <div className="sub-h">Delivery day</div>
      <div className="days">
        <button className={`day ${day === 'sun' ? 'sel' : ''}`} onClick={() => pickDay('sun')}>
          <b>Sunday</b><span>{dayMonth(dayDate(week, 'sun'))}</span>
        </button>
        <button className={`day ${day === 'mon' ? 'sel' : ''}`} onClick={() => pickDay('mon')}>
          <b>Monday</b><span>{dayMonth(dayDate(week, 'mon'))}</span>
        </button>
      </div>

      {message && <p className="error-msg">{message}</p>}

      {!authChecked ? null : !loggedIn ? (
        <InlineLogin next="/cart" variant="flat" />
      ) : needsAddress ? (
        <AddressForm profile={profile} onSaved={refreshAuth} variant="flat" />
      ) : null}

      {/* Keep the price and CTA on screen even while the login/address step is
          still open, so it's clear what finishing that step unlocks. */}
      <div className="cartbar">
        {belowMin && <div className="hint">Add {MIN_DISHES - count} more dish to continue</div>}
        {!belowMin && !canPay && authChecked && (
          <div className="hint">{loggedIn ? 'Add your delivery address to pay' : 'Log in above to pay'}</div>
        )}
        <button className="btn" onClick={onCheckout} disabled={placing || belowMin || !canPay}>
          <span>{placing ? 'Taking you to payment…' : 'Pay'}</span>
          <span className="cb-t">{euro(subtotal)}</span>
        </button>
      </div>
    </div>
  );
}
