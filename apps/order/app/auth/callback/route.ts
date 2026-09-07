import { createClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Where the magic-link email lands. The email carries a `token_hash` that we
// generated server-side, so verification happens here, on our own domain,
// and the session cookie is set before the redirect.
//
// Uses redirect() from next/navigation rather than NextResponse.redirect on
// purpose: verifyOtp writes the session cookie into the *pending* response,
// and building a fresh NextResponse would throw that away, logging the user
// straight back out again.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const next = searchParams.get('next') || '/';
  const safeNext = next.startsWith('/') ? next : '/'; // never redirect off-site
  const loginAgain = `/login?expired=1&next=${encodeURIComponent(safeNext)}`;

  const supabase = createClient();

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      console.error('auth/callback: verifyOtp failed —', error.message);
      redirect(loginAgain);
    }
    redirect(safeNext);
  }

  // Older emails (and Supabase's own hosted flow) arrive with ?code= instead.
  // Kept so links already sitting in someone's inbox don't dead-end.
  const code = searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('auth/callback: code exchange failed —', error.message);
      redirect(loginAgain);
    }
    redirect(safeNext);
  }

  console.error('auth/callback: no token_hash or code on the request');
  redirect(loginAgain);
}
