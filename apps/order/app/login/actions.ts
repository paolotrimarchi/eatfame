'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendMagicLinkEmail } from '@/lib/email';

// Shared by the standalone /login page and the inline login prompt shown
// mid-checkout -- `next` is where the magic link should land the user back
// on (e.g. "/cart", so they can pick up checkout right where they left it,
// since the basket itself lives in localStorage and survives the round trip).
export async function requestMagicLink(email: string, next: string = '/'): Promise<{ ok: boolean; message: string }> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }

  // Only ever redirect to a path on this site -- `next` ends up in a URL, so
  // without this check someone could craft a link that bounces a logged-in
  // user off to an external site after auth.
  const safeNext = next.startsWith('/') ? next : '/';

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (error || !data?.properties?.action_link) {
    return { ok: false, message: error?.message ?? 'Could not generate a login link.' };
  }

  try {
    await sendMagicLinkEmail(email, data.properties.action_link);
  } catch (err) {
    console.error('requestMagicLink: Resend send failed', err);
    return { ok: false, message: 'Could not send the login email. Try again in a moment.' };
  }

  return { ok: true, message: `Check ${email} for a login link.` };
}

// (The old FormData-based `sendMagicLink` wrapper is gone -- both the login
// page and the inline checkout login call requestMagicLink directly now, so
// they can manage their own sent/resend states.)
