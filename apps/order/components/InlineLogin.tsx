'use client';

import { useState } from 'react';
import { requestMagicLink } from '@/app/login/actions';

// Shown inline instead of redirecting away, so checkout doesn't lose its
// place. The basket itself is in localStorage, so once the magic link brings
// them back to this same page, everything's still here.
export default function InlineLogin({ next, variant = 'boxed' }: { next: string; variant?: 'boxed' | 'flat' }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage('');
    const res = await requestMagicLink(email, next);
    setMessage(res.message);
    setSent(res.ok);
    setSending(false);
  }

  return (
    <div className={variant === 'boxed' ? 'card' : ''}>
      {variant === 'boxed' ? (
        <h3 style={{ marginTop: 0, fontSize: 16 }}>Log in to order</h3>
      ) : (
        <div className="sub-h">Log in to order</div>
      )}
      <p className="muted" style={{ marginTop: variant === 'boxed' ? 0 : -6, marginBottom: 14 }}>
        No password needed -- we'll email you a link. Your basket will still be
        here when you get back.
      </p>

      {!sent ? (
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send login link'}
          </button>
        </form>
      ) : (
        <p style={{ margin: 0 }}>{message}</p>
      )}

      {!sent && message && <p className="muted" style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
