'use client';

import { useState } from 'react';
import { deleteAccount } from '@/app/account/actions';

// Two-step on purpose: this is irreversible, and a single tap next to "Log
// out" would be too easy to hit by accident.
export default function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <p style={{ margin: '28px 0 0' }}>
        <button
          className="muted"
          style={{ fontSize: 12.5, textDecoration: 'underline', padding: 0 }}
          onClick={() => setConfirming(true)}
        >
          Delete my account
        </button>
      </p>
    );
  }

  return (
    <div className="card" style={{ marginTop: 24, borderColor: '#f3c9c4' }}>
      <b style={{ display: 'block', marginBottom: 6, fontSize: 15 }}>Delete your account?</b>
      <p className="muted" style={{ margin: '0 0 14px' }}>
        This removes your login, delivery address and allergy details. We keep a record of
        what past orders contained and what they cost, without your address, for bookkeeping.
        This can&apos;t be undone.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <form action={deleteAccount}>
          <button className="btn btn-sm" type="submit" style={{ background: '#8c1d18' }}>
            Yes, delete it
          </button>
        </form>
        <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>Keep my account</button>
      </div>
    </div>
  );
}
