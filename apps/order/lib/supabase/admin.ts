// Service-role client. Bypasses RLS entirely -- only ever use this from
// trusted server-only code that has no logged-in user to scope to, like the
// Stripe webhook. Never import this from anything a browser could reach.
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
