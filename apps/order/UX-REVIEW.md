# UX review — Fame ordering app

Written 3 September 2026, against the app as it stands: home, restaurant, dish,
cart, orders, account, login. Opinionated on purpose. Roughly ordered by how
much damage each one does, not by how hard it is to fix.

---

## The one structural thing

The app is built as a fresh browse-and-pick flow, but the business is a weekly
repeat purchase. Every week, a returning customer has to re-navigate 13
restaurants and re-pick 4 dishes from scratch. That's the wrong default for a
product whose whole premise is "eat like you went out, all week", every week.

What I'd do: make "repeat last week" the primary action on Orders, and surface
it on Home too for anyone who's ordered before. Let them tweak from a
pre-filled basket instead of building one. This is the single highest-value
change on this list and it isn't a design tweak, it's a different shape for the
whole app.

Related: the delivery week is only chosen at the very end, in the cart. So
people browse and add dishes without knowing what date they're buying for. I'd
move the week choice to the top of Home as a small persistent selector ("For
Sunday 6 Sept · change"), which sets the context before browsing and stays
editable in the cart. It makes the product concept legible in the first three
seconds instead of the last three.

---

## Broken or nearly-broken

These read as bugs to a user, not preferences.

**You can't reach your basket from Home.** `CartBar` only renders on restaurant
and dish pages. Add dishes, tap Home, and the basket vanishes from the UI with
no badge on the bottom nav and no route back to `/cart` except entering a
restaurant again. Fix: render the cart bar on Home too, and put a count badge on
the bottom nav.

**"Back to my week" on the dish page goes to `/cart`.** That page is reached
from order history, after paying, when the basket is empty. So the button
reliably lands people on "Your basket is empty. Go add some dishes." Fix: send
it back to `/orders` when they arrived from there, or just use browser history.

**The heating-instructions empty state leaks internal instructions.** Right now
it says to edit the `cooking_instructions` column in Supabase. Every dish is
currently empty, so this is what customers would see. It has to be customer-safe
copy before anyone real uses this.

**The dish price sublabel says the opposite of what it means.**
`€16.00` with `at 4+ dishes` underneath reads as "€16 is the 4+ price". It's
actually the current price, with the discount tier being the thing you don't
have yet. Fix the copy to show both numbers: `€16.00 now · €13.00 at 4+`.

**Expired magic links fail silently.** `/auth/callback` redirects to `next`
whether or not the code exchange succeeded, so a stale link drops you on Home,
logged out, with no explanation. Show "that link expired" and offer a fresh one.

---

## Home

The green brand block eats about a quarter of the first screen on every single
visit. On the marketing site that's right. In an app someone opens weekly to buy
food, they already know where they are, and it's pushing the restaurant list
below the fold. Shrink it to a small inline wordmark, or drop it and put the
week selector there instead.

"Order for any of the next few weeks" is a leftover marketing line that doesn't
tell anyone anything actionable. Replace with the actual week selector.

Restaurant cards show rating and cuisine tags but not the thing people decide
on, which is what's inside and roughly what it costs. Add "from €13" and two or
three dish names per card. Right now choosing a restaurant is a blind tap.

No search or filter. Fine at 13 restaurants, painful at 30. Not urgent.

---

## Restaurant page

The tier nudge is the pricing mechanic and it's styled like a passive notice, so
it reads as decoration. It also doesn't say what you'd save. "Add 2 more dishes
for the best price" is much weaker than "Add 2 more → €13.00 a dish instead of
€16.00, saves you €6".

The 2-dish minimum is never mentioned here. You discover it in the cart, as a
disabled button. Constraints should be stated before they block you, not at the
moment they do.

Prices across the whole list silently change as you add dishes, which is the
nicest thing in the app and completely unremarked. When someone crosses a tier,
say so — a brief toast, "prices just dropped to €13 a dish".

While browsing a second restaurant, there's no way to see what you've already
picked from the first. Weekly planning is inherently "what have I got so far".
An expandable peek in the cart bar would cover it.

---

## Cart

This is the screen doing the most work and it shows.

Dates are shown as "w/c 6 Sept" in a four-across grid. Nobody thinks in
week-commencing notation. Show real dates: "Sun 6 Sept".

The day cards say "Sunday / Delivery" and "Monday / Delivery" — the second line
is filler on both, so it's pure noise.

The 2-day lead time is invisible, so if someone wonders why this week isn't
offered, there's no answer on screen.

The tier nudge doesn't exist here, which is where intent is highest. If someone
has 3 dishes in the basket at €14 each, this page should be telling them a 4th
brings all of them to €13.

Once the inline address form appears, the price and CTA disappear entirely, and
nothing signals that saving the address is what unlocks payment. Keep a disabled
"Pay €35.00" visible with a hint, or jump straight to payment after saving.

The button label "Order for w/c 6 Sept · €35.00" is doing three jobs. The week
is already selected and visible above it. Just say "Pay €35.00".

---

## Orders

Dates render as raw ISO — "w/c 2026-09-06 · Sunday". Should be "Sunday 6
September".

Repeat orders for the same week are visually identical with nothing to tell them
apart. Add the date it was placed and a short order reference.

The `status` column exists in the database and isn't shown anywhere, so the only
state a customer sees is paid/pending. For a delivery product, "where is my
food" is the top support question. Show fulfilment state even if you're updating
it by hand at first.

The terms promise cancellation up to 48 hours before delivery by email, and the
app offers no way to do it. That mismatch generates support mail. At minimum,
show the policy and a mailto link on upcoming orders.

Heating instructions are the differentiator and they're a small underlined link
that costs a page load. Inline them as a collapsible section on the order card.

The empty state with the illustration is genuinely good. Leave it alone.

---

## Account

It's one flat card with six fields and fourteen allergen chips, on a page whose
most common visit is probably "check my address" or "log out". Once an address is
saved, collapse it to a one-line summary with an Edit affordance. Same for
allergies — hide behind "Add allergies" until used.

There's no delete-my-account action, while the privacy notice promises deletion
on request. Email is legally fine, a button is better and cheap.

---

## Login

No brand mark, no explanation of what Fame is. Someone landing here from an
expired link gets a bare email field on a cream background.

After sending, feedback is a small grey line under a button that stays enabled
and unchanged. This is the most important single step in the app. Replace the
form with a proper "Check your inbox" state, echo the address you sent to, and
offer a resend after 30 seconds.

---

## Cross-cutting

**The back button.** A floating "‹" circle with no label, hardcoded to `/` or
`/cart` rather than actual history, overlapping imagery on some pages. It can
send you somewhere you've never been. Make it history-aware and consistent.

**No loading states.** The cart fetches dishes client-side and shows an empty
list first, then pops; the auth gate renders nothing, then content. Add
skeletons for both.

**Errors don't look like errors.** Payment failures and validation problems are
the same muted grey as helper text.

**Touch targets.** The quantity +/- buttons in the cart are 30px. 44px is the
floor on mobile. The inactive bottom-nav colour (40% green on cream) is likely
under the 4.5:1 contrast minimum.

**Number formatting.** Prices are "€16.00" throughout; Dutch convention is
"€ 16,00". If the audience is Amsterdam locals, format for them.

**Chips look tappable and aren't.** Cuisine tags read as filters. Either make
them filter, or restyle them so they don't invite a tap.

---

## If you only do five things

1. Make repeat-last-week the primary path.
2. Move the delivery week to the top of Home, before browsing.
3. Make the basket reachable from Home (cart bar + nav badge).
4. Fix the customer-facing copy bugs: dish price sublabel, ISO dates, the
   Supabase-instructions empty state, "Back to my week".
5. Rebuild the login sent-state and handle expired links.
