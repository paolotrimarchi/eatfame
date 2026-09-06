-- Adds payment tracking to orders, separate from fulfillment status.
-- payment_status: unpaid (order row created, Stripe Checkout not finished
-- yet) -> paid (Stripe webhook confirmed the charge) -> refunded.

alter table orders
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

create index if not exists orders_stripe_session_idx on orders(stripe_checkout_session_id);

-- The webhook that marks an order paid runs with no logged-in user (Stripe
-- calls it directly), so it uses the service-role key and bypasses RLS.
-- Nothing else changes here -- the existing "users manage their own orders"
-- policy still governs everything the app itself does.
