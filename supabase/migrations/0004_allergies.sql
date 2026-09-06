-- Self-reported allergies, the same pattern Uber Eats uses: the customer
-- flags what applies to them once (on their profile), it gets snapshotted
-- onto each order same as the delivery address, and it's surfaced prominently
-- wherever someone would be fulfilling that order (order history, the
-- confirmation email). This doesn't replace per-dish allergen labelling --
-- see the TODO in app/terms/page.tsx -- but it's the same starting point
-- Uber Eats itself uses before any restaurant-side labelling exists.

alter table profiles
  add column if not exists allergies text[] not null default '{}';

alter table orders
  add column if not exists delivery_allergies text[] not null default '{}';
