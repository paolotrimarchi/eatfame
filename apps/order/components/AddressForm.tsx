'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { saveProfile } from '@/app/account/actions';
import { EU_ALLERGENS } from '@/lib/types';
import type { Profile } from '@/lib/types';

const initialState = { ok: false as const, message: '' };

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button className="btn btn-sm" type="submit" disabled={disabled || pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}

type Props = {
  profile: Profile | null;
  onSaved?: () => void;
  // 'boxed' (default) is the standalone white card used on /account.
  // 'flat' drops the card chrome and uses the same uppercase section label
  // as the week/day pickers, so it reads as one more step in the cart flow
  // instead of an unrelated widget dropped at the bottom of the page.
  variant?: 'boxed' | 'flat';
};

export default function AddressForm({ profile, onSaved, variant = 'boxed' }: Props) {
  const [state, formAction] = useFormState(saveProfile, initialState);

  // Controlled, so the Save button can stay disabled until everything
  // required is actually filled in -- rather than just relying on the
  // browser's native "required" popup after a click.
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [addressLine1, setAddressLine1] = useState(profile?.address_line1 ?? '');
  const [addressLine2, setAddressLine2] = useState(profile?.address_line2 ?? '');
  const [postcode, setPostcode] = useState(profile?.postcode ?? '');
  const [city, setCity] = useState(profile?.city ?? 'Amsterdam');
  const [allergies, setAllergies] = useState<Set<string>>(new Set(profile?.allergies ?? []));
  const [showAllergies, setShowAllergies] = useState(false);

  function toggleAllergen(a: string) {
    setAllergies((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a); else next.add(a);
      return next;
    });
  }

  const isValid = !!(fullName.trim() && addressLine1.trim() && postcode.trim() && city.trim());

  useEffect(() => {
    if (state.ok && onSaved) onSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className={variant === 'boxed' ? 'card' : ''}>
      {variant === 'boxed' ? (
        <>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Delivery details</h3>
          <p className="muted" style={{ marginTop: 0, marginBottom: 14 }}>
            Needed once so we know where to drop the food off.
          </p>
        </>
      ) : (
        <>
          <div className="sub-h">Delivery details</div>
          <p className="muted" style={{ marginTop: -6, marginBottom: 14 }}>
            One more thing -- needed so we know where to drop the food off.
          </p>
        </>
      )}

      <input type="text" name="full_name" placeholder="Full name" autoComplete="name" value={fullName}
        onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
      <input type="tel" name="phone" placeholder="Phone number (optional)" autoComplete="tel" value={phone}
        onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
      <input type="text" name="address_line1" placeholder="Street and house number" autoComplete="address-line1" value={addressLine1}
        onChange={(e) => setAddressLine1(e.target.value)} required style={inputStyle} />
      <input type="text" name="address_line2" placeholder="Apartment, floor, etc. (optional)" autoComplete="address-line2" value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)} style={inputStyle} />
      <div style={{ display: 'flex', gap: 10 }}>
        <input type="text" name="postcode" placeholder="Postcode" autoComplete="postal-code" value={postcode}
          onChange={(e) => setPostcode(e.target.value)} required style={{ ...inputStyle, flex: '0 0 120px' }} />
        <input type="text" name="city" placeholder="City" autoComplete="address-level2" value={city}
          onChange={(e) => setCity(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
      </div>

      {/* Fourteen chips would dominate the form for the majority who don't
          need any of them, so this stays folded away until asked for. */}
      {!showAllergies ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ margin: '4px 0 14px' }}
          onClick={() => setShowAllergies(true)}
        >
          {allergies.size > 0 ? `Allergies: ${Array.from(allergies).join(', ')}` : '+ Add allergies'}
        </button>
      ) : (
        <>
          <div className="muted" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, margin: '14px 0 8px' }}>
            Allergies (optional)
          </div>
          <p className="muted" style={{ marginTop: 0, marginBottom: 10, fontSize: 12.5 }}>
            Flag what applies to you once and every order carries it. We can&apos;t promise a dish
            is free of it, but we&apos;ll know to check with the restaurant.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {EU_ALLERGENS.map((a) => {
              const selected = allergies.has(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  style={{
                    minHeight: 40,
                    padding: '7px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    border: `1.5px solid ${selected ? 'var(--green)' : 'var(--line)'}`,
                    background: selected ? 'var(--tint)' : 'var(--surface)',
                    color: selected ? 'var(--green)' : 'var(--muted)',
                  }}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </>
      )}
      {Array.from(allergies).map((a) => (
        <input key={a} type="hidden" name="allergies" value={a} />
      ))}

      <SaveButton disabled={!isValid} />

      {!state.ok && state.message && <p className="muted" style={{ marginTop: 10, color: '#b3261e' }}>{state.message}</p>}
      {state.ok && <p className="muted" style={{ marginTop: 10, color: 'var(--green-500)' }}>Saved.</p>}
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 16px',
  fontSize: 15,
  border: '1.5px solid var(--line)',
  borderRadius: 14,
  background: 'var(--surface)',
  color: 'var(--green)',
  marginBottom: 10,
};
