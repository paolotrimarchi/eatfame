-- Delivery address, kept on the account so it's only entered once, plus a
-- snapshot of it on each order (so a later address change doesn't rewrite
-- history for orders already placed).

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  postcode text,
  city text not null default 'Amsterdam',
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users manage their own profile" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table orders
  add column if not exists delivery_full_name text,
  add column if not exists delivery_phone text,
  add column if not exists delivery_address_line1 text,
  add column if not exists delivery_address_line2 text,
  add column if not exists delivery_postcode text,
  add column if not exists delivery_city text;
