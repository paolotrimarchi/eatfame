import Link from 'next/link';
import BackButton from '@/components/BackButton';

// TODO: if/when you register a business (KvK number), replace the
// "who's responsible" section with your legal entity name and number --
// GDPR expects the controller to be clearly identifiable, and a KvK number
// makes that unambiguous. Placeholder contact email below too, if
// hello@eatfame.com isn't the one you want people to actually use.
export default function PrivacyPage() {
  return (
    <div className="wrap prose" style={{ paddingTop: 20 }}>
      <BackButton fallback="/account" />
      <h1 className="page-h">Privacy notice</h1>
      <span className="meta muted">Last updated 3 September 2026 · applies to app.eatfame.com</span>

      <div className="callout">
        This covers the ordering app, where placing an order means giving us your delivery
        address and paying for real. It replaces the pre-launch waitlist notice on eatfame.com,
        which only covered signing up to be notified.
      </div>

      <h2>Who is responsible</h2>
      <p>
        Fame is run by a private individual based in Amsterdam, the Netherlands. For anything
        in this notice, including any request about your data, contact{' '}
        <a href="mailto:hello@eatfame.com">hello@eatfame.com</a>.
      </p>

      <h2>What we collect</h2>
      <p>To create an account and place an order, we store:</p>
      <ul>
        <li>your email address, used to log in via a one-time link (we don't use passwords);</li>
        <li>your name, phone number and delivery address, so we know who and where to deliver to;</li>
        <li>any allergies you choose to flag on your account (this is optional, and health data, so it's only ever used to pass on to the restaurant, never for anything else);</li>
        <li>the dishes, quantities, delivery week and day for each order you place, and its price;</li>
        <li>whether an order has been paid, and Stripe's reference for that payment.</li>
      </ul>
      <p>
        We never see or store your card details. Payment is handled entirely by Stripe on their
        own checkout page.
      </p>

      <h2>Why we use it, and on what legal basis</h2>
      <ul>
        <li><b>To take and deliver your order.</b> Basis: performance of a contract with you, the order itself.</li>
        <li><b>To log you in without a password.</b> Basis: performance of a contract -- this is how the account works.</li>
        <li><b>To email you a receipt and login links.</b> Basis: performance of a contract.</li>
        <li><b>To pass on any allergy you flag to whoever prepares your order.</b> Basis: your
          explicit consent -- allergy information counts as health data under GDPR, so this is
          the one thing here that isn't just "because you ordered." It's entirely optional and
          you can remove it from your account at any time.</li>
      </ul>
      <p>We don't currently use your data for advertising or marketing emails.</p>

      <h2>Cookies</h2>
      <p>
        This app sets one cookie: the session cookie that keeps you logged in. Nothing else --
        no analytics, no advertising, on this subdomain.
      </p>

      <h2>Who else sees it</h2>
      <table>
        <tr><th>Who</th><th>What for</th><th>Where</th></tr>
        <tr><td>Supabase</td><td>Stores your account and order data</td><td>EU</td></tr>
        <tr><td>Stripe</td><td>Processes payment; we never see your card</td><td>EU / USA</td></tr>
        <tr><td>Resend</td><td>Sends login links and order emails</td><td>EU / USA</td></tr>
        <tr><td>Vercel Inc.</td><td>Hosting and server logs</td><td>USA</td></tr>
      </table>
      <p>
        We do not sell your data, and we don't share your name, address or phone number with the
        restaurants -- they receive an aggregated prep list, not your personal details.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Your account, delivery address and order history are kept as long as your account exists,
        so you can see past orders. If you ask us to delete your account, we remove your profile
        and address; we may keep a minimal record of past orders (what was ordered and its price,
        not your address) for our own bookkeeping.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the GDPR you can ask for a copy of your data, ask us to correct or delete it, object
        to or restrict how we use it, and ask for it in a portable format. Email{' '}
        <a href="mailto:hello@eatfame.com">hello@eatfame.com</a> and we'll act within one month.
      </p>
      <p>
        If you're unhappy with how we've handled things, you can complain to the Dutch data
        protection authority, the{' '}
        <a href="https://autoriteitpersoonsgegevens.nl" rel="noopener" target="_blank">
          Autoriteit Persoonsgegevens
        </a>.
      </p>

      <h2>Changes</h2>
      <p>If this notice changes we'll update the date at the top.</p>

      <p className="muted"><Link href="/">Back to Fame</Link></p>
    </div>
  );
}
