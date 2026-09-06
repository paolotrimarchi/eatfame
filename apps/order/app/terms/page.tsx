import Link from 'next/link';
import BackButton from '@/components/BackButton';

// TODO before this handles real money at any real volume: get an actual
// lawyer to check this, especially the cancellation/refund cutoff (currently
// a placeholder guess) and the allergen line -- serving real food without
// per-dish allergen info is a legal requirement in the EU (Regulation (EU)
// 1169/2011), not just good practice, and the dishes table has no field for
// it yet.
export default function TermsPage() {
  return (
    <div className="wrap prose" style={{ paddingTop: 20 }}>
      <BackButton fallback="/account" />
      <h1 className="page-h">Terms of service</h1>
      <span className="meta muted">Last updated 3 September 2026 · applies to app.eatfame.com</span>

      <div className="callout">
        Fame is a small, early-stage service run by an individual, not a registered company yet.
        These terms are a starting point, not a substitute for proper legal advice once this
        takes real orders at any real volume.
      </div>

      <h2>What Fame is</h2>
      <p>
        Fame lets you order dishes from partner restaurants in Amsterdam for delivery on a
        future date you choose. We take your order and payment, and arrange delivery to the
        address you provide.
      </p>

      <h2>Ordering and payment</h2>
      <p>
        Prices shown at checkout are what you pay, in EUR, charged immediately through Stripe
        when you place the order. An order is confirmed once payment succeeds.
      </p>

      <h2>Delivery</h2>
      <p>
        You choose a delivery week and either Sunday or Monday. We deliver to the address on
        your account at the time of ordering. We don't yet guarantee a specific time slot within
        that day.
      </p>

      <h2>Cancellations and refunds</h2>
      <p>
        You can cancel for a full refund up to 48 hours before your chosen delivery day, by
        emailing <a href="mailto:hello@eatfame.com">hello@eatfame.com</a>. After that point food
        preparation is already underway with our restaurant partners, so we can't offer a refund
        except where the order itself was faulty (wrong, missing, or spoiled items).
      </p>

      <h2>Allergens and dietary needs</h2>
      <p>
        Dishes are prepared by our partner restaurants, not by Fame. You can flag any allergies
        on your account, and we'll pass that on with your order -- but this doesn't guarantee a
        dish is free of it, since we don't yet have full per-dish allergen information from every
        restaurant. If you have a serious allergy, email{' '}
        <a href="mailto:hello@eatfame.com">hello@eatfame.com</a> before ordering so we can check
        directly with the restaurant.
      </p>

      <h2>Liability</h2>
      <p>
        We're not liable for delays or issues caused by circumstances outside our control. Beyond
        that, our liability is limited to the value of the order in question.
      </p>

      <h2>Your account</h2>
      <p>
        You log in with a one-time link sent to your email, no password. Keep access to that
        inbox secure -- anyone with access to it can log in as you.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the service changes. If we do, we'll update the date at the
        top of this page.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href="mailto:hello@eatfame.com">hello@eatfame.com</a>.</p>

      <p className="muted"><Link href="/">Back to Fame</Link></p>
    </div>
  );
}
