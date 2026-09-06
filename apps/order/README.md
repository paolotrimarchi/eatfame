# Fame ordering app

Next.js app for logging in, browsing restaurants/dishes, ordering for a future
week, paying for it, seeing past orders, and reading how to heat each dish.
Lives in this `apps/order` folder inside the main eatfame.com repo so it can
be its own Vercel project, deployed separately from the main site.

## First-time setup

1. **Create a Supabase project** at supabase.com (free tier is plenty).
2. In the SQL editor, run `../supabase/migrations/0001_init.sql`, then
   `../supabase/migrations/0002_payments.sql`, then
   `../supabase/migrations/0003_addresses.sql`, then
   `../supabase/migrations/0004_allergies.sql`, then `../supabase/seed.sql`
   (loads the current restaurants/dishes so you don't retype the menu).
3. Fill in `cooking_instructions` for each row in the `dishes` table —
   these were never part of the old site, so they start empty.
4. In Supabase, go to Authentication → URL Configuration and add:
   - Site URL: `http://localhost:3000` (change to `https://app.eatfame.com` once deployed)
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://app.eatfame.com/auth/callback`
5. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` from the same page (this one's secret — never share it or commit it)
6. **Set up Stripe** (see below), then fill in `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
7. **Set up Resend** (see below), then fill in `RESEND_API_KEY` and `EMAIL_FROM`.
8. `npm install`
9. `npm run dev` — app runs at localhost:3000.

## Stripe setup

1. Create a Stripe account at stripe.com if you don't have one. Stay in
   **Test mode** (toggle top-right of the dashboard) until you're ready to
   take real payments.
2. Dashboard → Developers → API keys → copy the **Secret key** (`sk_test_...`)
   into `STRIPE_SECRET_KEY`.
3. To test payments locally, install the Stripe CLI (`brew install stripe/stripe-cli/stripe`
   on a Mac), run `stripe login` once, then keep this running in a second
   terminal tab whenever you're testing checkout:
   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a webhook signing secret (`whsec_...`) — put that in
   `STRIPE_WEBHOOK_SECRET`.
4. For the deployed version, go to Dashboard → Developers → Webhooks → Add
   endpoint → URL `https://app.eatfame.com/api/webhooks/stripe` → listen for
   `checkout.session.completed` → copy its signing secret into the
   `STRIPE_WEBHOOK_SECRET` env var on Vercel.
5. Test card number for checkout: `4242 4242 4242 4242`, any future expiry,
   any 3-digit CVC, any postcode.

How it works: placing an order first saves it in Supabase as `unpaid`, then
sends the customer to a Stripe-hosted Checkout page. Stripe calls the webhook
once the charge succeeds, which is what actually flips the order to `paid`.
The order will show up under "My orders" as soon as it's saved, tagged
"Payment pending" until the webhook confirms it.

## Email setup (Resend)

Both the login link and the order-confirmation email now go through Resend
with our own branded template, instead of Supabase's default (unbranded,
low-volume) auth emails.

1. Create a free account at resend.com.
2. Dashboard → API Keys → create one → put it in `RESEND_API_KEY`.
3. Dashboard → Domains → add `eatfame.com` → add the DNS records it gives you
   wherever eatfame.com's DNS is managed (likely the same place you pointed
   `app.eatfame.com` at Vercel). Verification usually takes a few minutes.
4. Once verified, set `EMAIL_FROM` to something like `Fame <orders@eatfame.com>`.
   Until then, leave it as `Fame <onboarding@resend.dev>` — that address only
   delivers to your own Resend account's email, so it's fine for testing but
   won't reach real customers.
5. You can turn off Supabase's own auth emails entirely once this is live
   (Authentication → Emails in Supabase) so there's no chance of a login ever
   going out with the old unbranded template by mistake.

## Deploying

In Vercel: Add New → Project → import the `eatfame` repo again → set
**Root Directory** to `apps/order` → add the same env vars from `.env.local`
(with the production Stripe webhook secret from step 4 above) → deploy → add
`app.eatfame.com` as a custom domain on this project.

## What's here vs. still to do

- Login (magic link), browse restaurants/dishes, order for a week, pay via
  Stripe Checkout, order history, a "how to heat it" page per dish, and
  branded login + order-confirmation emails via Resend — all working against
  Supabase + Stripe + Resend.
- Checkout on `/cart` gates inline (no redirect, basket stays put): logs you
  in via email link if needed, then asks for a delivery address the first
  time, before showing the pay button. The address is snapshotted onto each
  order, so later edits on the Account page never rewrite a past order.
- Dish/restaurant photos are pulled live from `eatfame.com/img/...` rather
  than duplicated here.
