import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// The link in the magic-link email points here with a one-time `code`.
// Exchange it for a real session, then send the user back to wherever they
// started logging in from (e.g. mid-checkout on /cart), defaulting home.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  const next = searchParams.get('next') || '/';
  const safeNext = next.startsWith('/') ? next : '/'; // never redirect off-site

  // A used or expired link used to fail silently here and dump people on the
  // home page, logged out, with no idea why. Send them back to login with
  // something to read instead.
  if (!code) {
    return NextResponse.redirect(`${origin}/login?expired=1&next=${encodeURIComponent(safeNext)}`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('auth/callback: code exchange failed', error.message);
    return NextResponse.redirect(`${origin}/login?expired=1&next=${encodeURIComponent(safeNext)}`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
