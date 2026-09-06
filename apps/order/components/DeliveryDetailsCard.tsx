'use client';

import { useState } from 'react';
import AddressForm from './AddressForm';
import { hasDeliveryAddress, type Profile } from '@/lib/types';

// Once an address is saved, the most common reason to visit Account is to
// glance at it, not re-type it -- so show a one-line summary and keep the
// six-field form behind Edit.
export default function DeliveryDetailsCard({ profile }: { profile: Profile | null }) {
  const saved = hasDeliveryAddress(profile);
  const [editing, setEditing] = useState(!saved);

  if (editing) {
    return (
      <div>
        <AddressForm profile={profile} onSaved={() => saved && setEditing(false)} />
        {saved && (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <p className="muted" style={{ margin: '0 0 4px' }}>Delivering to</p>
          <b style={{ display: 'block', fontSize: 14.5 }}>{profile?.full_name}</b>
          <span style={{ fontSize: 14 }}>
            {profile?.address_line1}
            {profile?.address_line2 ? `, ${profile.address_line2}` : ''}
            <br />
            {profile?.postcode} {profile?.city}
          </span>
          {profile?.phone && (
            <span className="muted" style={{ display: 'block', marginTop: 4, fontSize: 13 }}>{profile.phone}</span>
          )}
          {profile?.allergies && profile.allergies.length > 0 && (
            <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: '#8a5a1e', fontWeight: 600 }}>
              ⚠ {profile.allergies.join(', ')}
            </span>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>
      </div>
    </div>
  );
}
