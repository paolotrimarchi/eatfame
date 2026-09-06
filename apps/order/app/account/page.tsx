import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from './actions';
import DeliveryDetailsCard from '@/components/DeliveryDetailsCard';
import DeleteAccount from '@/components/DeleteAccount';
import type { Profile } from '@/lib/types';

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle() as { data: Profile | null };

  return (
    <div className="wrap pad-bar" style={{ paddingTop: 20 }}>
      <h1 className="page-h" style={{ marginTop: 0 }}>Account</h1>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p className="muted" style={{ margin: 0 }}>Logged in as</p>
          <b>{user.email}</b>
        </div>
        <form action={signOut}>
          <button className="btn btn-ghost btn-sm" type="submit">Log out</button>
        </form>
      </div>

      <DeliveryDetailsCard profile={profile} />

      <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>
        <Link href="/privacy">Privacy notice</Link> · <Link href="/terms">Terms of service</Link>
      </p>

      <DeleteAccount />
    </div>
  );
}
