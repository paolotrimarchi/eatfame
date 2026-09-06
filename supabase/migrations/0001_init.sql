-- Fame ordering app: core schema.
-- Run this in the Supabase SQL editor (or via `supabase db push` once the
-- CLI is linked to your project).

create extension if not exists "pgcrypto";

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  blurb text,
  rating numeric(2,1),
  reviews text,
  tags text[] not null default '{}',
  image_path text,           -- e.g. img/restaurants/pasta-pasta.jpg
  sort_order int not null default 0
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  slug text not null,                 -- matches the old dish id, e.g. "pesto"
  name text not null,
  description text,
  price_at_2 numeric(6,2) not null,   -- price per dish at 2 dishes in the basket
  price_at_3 numeric(6,2) not null,   -- price per dish at 3 dishes
  price_at_4 numeric(6,2) not null,   -- best price, 4+ dishes
  image_path text,                    -- e.g. img/dishes/pasta-pasta/pesto.jpg
  cooking_instructions text,          -- shown on the "how to heat this" page
  unique (restaurant_id, slug)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delivery_week_start date not null,          -- the Sunday that starts the delivery week
  delivery_day text not null check (delivery_day in ('sun', 'mon')),
  status text not null default 'placed' check (status in ('placed', 'confirmed', 'delivered', 'cancelled')),
  subtotal numeric(8,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  dish_id uuid not null references dishes(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(6,2) not null   -- price actually charged, snapshotted at order time
);

-- ---------- row level security ----------

alter table restaurants enable row level security;
create policy "Anyone can read restaurants" on restaurants
  for select using (true);

alter table dishes enable row level security;
create policy "Anyone can read dishes" on dishes
  for select using (true);

alter table orders enable row level security;
create policy "Users manage their own orders" on orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table order_items enable row level security;
create policy "Users manage their own order items" on order_items
  for all using (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  ) with check (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

create index if not exists dishes_restaurant_id_idx on dishes(restaurant_id);
create index if not exists order_items_order_id_idx on order_items(order_id);
create index if not exists orders_user_id_idx on orders(user_id);
