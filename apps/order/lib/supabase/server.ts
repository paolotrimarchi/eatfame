// Supabase client for use on the server (server components, actions, routes).
// Reads/writes the auth session via cookies, per @supabase/ssr's Next.js recipe.
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll gets called from a Server Component sometimes, where
            // cookies can't be written. Safe to ignore -- middleware refreshes
            // the session on every request anyway.
          }
        },
      },
    }
  );
}
