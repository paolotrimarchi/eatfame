'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { requestMagicLink } from './actions';

// useSearchParams() opts the page into client-side rendering, and a production
// build refuses to prerender that without a Suspense boundary around it. Dev
// doesn't enforce this, so it only shows up at build time.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: 24 }} />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const expired = searchParams.get('expired') === '1';

  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState('');
  // Resend is held back briefly so the first email has a chance to arrive
  // before someone taps again and gets confused about which link is live.
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function send(address: string) {
    setSending(true);
    setError('');
    const res = await requestMagicLink(address, next);
    setSending(false);
    if (res.ok) {
      setSentTo(address);
      setResendIn(30);
    } else {
      setError(res.message);
    }
  }

  if (sentTo) {
    return (
      <div className="wrap" style={{ paddingTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 12 }}>✉️</div>
        <h1 className="page-h" style={{ marginTop: 0 }}>Check your inbox</h1>
        <p className="muted" style={{ marginBottom: 4 }}>We sent a login link to</p>
        <p style={{ fontWeight: 650, margin: '0 0 24px' }}>{sentTo}</p>
        <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
          It works once and expires shortly. If it doesn&apos;t show up, check your spam folder —
          we&apos;re a new sender, so filters are still learning to trust us.
        </p>

        <button
          className="btn btn-ghost"
          onClick={() => send(sentTo)}
          disabled={sending || resendIn > 0}
        >
          {sending ? 'Sending…' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend the link'}
        </button>

        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 12 }}
          onClick={() => { setSentTo(null); setError(''); }}
        >
          Use a different email
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    );
  }

  return (
    <div className="wrap" style={{ paddingTop: 24 }}>
      <div className="brandmark compact" style={{ margin: '0 0 20px' }}>
        <div className="wordmark">Fame.</div>
      </div>

      {expired && (
        <p className="error-msg" style={{ marginTop: 0, marginBottom: 18 }}>
          That link had already been used or expired. Here&apos;s a fresh one.
        </p>
      )}

      <h1 className="page-h" style={{ marginTop: 0 }}>Log in</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        No password needed. We&apos;ll email you a link. New here? This creates your account too.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); send(email.trim()); }}
      >
        <input
          type="email"
          name="email"
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

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
