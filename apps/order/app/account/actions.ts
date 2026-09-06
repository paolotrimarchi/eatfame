'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

// The privacy notice promises deletion on request; a button is better than
// asking people to email. Past orders are deliberately left in place (minus
// the address, which lives on the profile) for bookkeeping -- that's what the
// privacy notice says happens, so keep the two in sync if this changes.
export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const admin = createAdminClient();

  // Clear the delivery snapshot from past orders, then drop the profile.
  await admin
    .from('orders')
    .update({
      delivery_full_name: null,
      delivery_phone: null,
      delivery_address_line1: null,
      delivery_address_line2: null,
      delivery_postcode: null,
      delivery_allergies: [],
    })
    .eq('user_id', user.id);

  await admin.from('profiles').delete().eq('user_id', user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) console.error('deleteAccount: could not delete auth user', error.message);

  await supabase.auth.signOut();
  redirect('/login?deleted=1');
}

type SaveProfileResult = { ok: true } | { ok: false; message: string };

export async function saveProfile(_: unknown, formData: FormData): Promise<SaveProfileResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'You need to log in first.' };

  const full_name = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const address_line1 = String(formData.get('address_line1') || '').trim();
  const address_line2 = String(formData.get('address_line2') || '').trim();
  const postcode = String(formData.get('postcode') || '').trim();
  const city = String(formData.get('city') || 'Amsterdam').trim() || 'Amsterdam';
  const allergies = formData.getAll('allergies').map((v) => String(v));

  if (!full_name || !address_line1 || !postcode) {
    return { ok: false, message: 'Name, address and postcode are all needed for delivery.' };
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      full_name,
      phone: phone || null,
      address_line1,
      address_line2: address_line2 || null,
      postcode,
      city,
      allergies,
      updated_at: new Date().toISOString(),
    });

  if (error) return { ok: false, message: error.message };

  revalidatePath('/account');
  revalidatePath('/cart');
  return { ok: true };
}
