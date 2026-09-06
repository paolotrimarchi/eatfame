// All transactional email goes through Resend with our own branded templates
// -- this is what replaces Supabase's default (unbranded, rate-limited)
// auth emails. Server-only: never import this from a client component.
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? 'Fame <onboarding@resend.dev>';

function wrapper(preheader: string, bodyHtml: string) {
  // Georgia is the same serif fallback the site's own CSS uses when the
  // custom webfont isn't available -- email clients won't load a self-hosted
  // font reliably, so this leans on the fallback stack on purpose.
  return `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ecc4;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fffacc;border-radius:24px;overflow:hidden;font-family:-apple-system,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:28px 32px 8px;">
          <div style="background:#05391b;border-radius:20px;padding:18px;text-align:center;margin-bottom:22px;">
            <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:700;font-size:30px;color:#fffacc;">Fame.</span>
          </div>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:8px 32px 28px;">
          <p style="font-family:Georgia,serif;font-style:italic;color:rgba(5,57,27,.45);font-size:14px;text-align:center;margin:24px 0 0;">Fame · Amsterdam</p>
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}

export async function sendMagicLinkEmail(to: string, link: string) {
  const resend = getResend();
  if (!resend) {
    console.warn('sendMagicLinkEmail: RESEND_API_KEY not set, skipping (link:', link, ')');
    return;
  }

  const html = wrapper(
    'Your Fame login link',
    `
    <h1 style="color:#05391b;font-size:22px;margin:0 0 12px;">Log in to Fame</h1>
    <p style="color:#57684f;font-size:15px;line-height:1.5;margin:0 0 22px;">
      Tap the button below to log in. This link works once and expires shortly.
    </p>
    <a href="${link}" style="display:block;background:#05391b;color:#fffacc;text-decoration:none;
       text-align:center;border-radius:999px;padding:16px;font-weight:600;font-size:16px;">
      Log in
    </a>
    <p style="color:#57684f;font-size:12.5px;line-height:1.5;margin:20px 0 0;">
      Didn't request this? You can safely ignore this email.
    </p>`
  );

  const text = `Log in to Fame\n\nTap the link below to log in. This link works once and expires shortly.\n\n${link}\n\nDidn't request this? You can safely ignore this email.`;

  await resend.emails.send({ from: FROM, to, subject: 'Your login link for Fame', html, text });
}

type OrderConfirmationInput = {
  to: string;
  deliveryWeekStart: string;
  deliveryDay: 'sun' | 'mon';
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  delivery?: {
    fullName: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    postcode: string | null;
    city: string | null;
  } | null;
  allergies?: string[];
};

export async function sendOrderConfirmationEmail({ to, deliveryWeekStart, deliveryDay, items, subtotal, delivery, allergies }: OrderConfirmationInput) {
  const resend = getResend();
  if (!resend) {
    console.warn('sendOrderConfirmationEmail: RESEND_API_KEY not set, skipping');
    return;
  }

  const rows = items.map((it) => `
    <tr>
      <td style="padding:6px 0;color:#05391b;font-size:14px;">${it.quantity}× ${it.name}</td>
      <td style="padding:6px 0;color:#05391b;font-size:14px;text-align:right;">€${(it.unitPrice * it.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const addressBlock = delivery && delivery.addressLine1 ? `
    <p style="color:#57684f;font-size:13px;line-height:1.5;margin:0 0 18px;">
      Delivering to ${delivery.fullName ?? ''}<br/>
      ${delivery.addressLine1}${delivery.addressLine2 ? `, ${delivery.addressLine2}` : ''}<br/>
      ${delivery.postcode ?? ''} ${delivery.city ?? ''}
    </p>` : '';

  const allergyBlock = allergies && allergies.length > 0 ? `
    <p style="background:#fdeee0;border:1px solid #f3d5b0;border-radius:12px;padding:10px 14px;
       color:#8a5a1e;font-size:13px;font-weight:700;margin:0 0 18px;">
      ⚠ Allergies flagged on this account: ${allergies.join(', ')}
    </p>` : '';

  const html = wrapper(
    'Your Fame order is confirmed',
    `
    <h1 style="color:#05391b;font-size:22px;margin:0 0 6px;">Your order is confirmed</h1>
    <p style="color:#57684f;font-size:15px;line-height:1.5;margin:0 0 12px;">
      Delivery week of ${deliveryWeekStart}, ${deliveryDay === 'sun' ? 'Sunday' : 'Monday'}.
    </p>
    ${addressBlock}
    ${allergyBlock}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background:#fffef6;border:1px solid #efe7bd;border-radius:20px;padding:16px 18px;margin-bottom:18px;">
      ${rows}
      <tr><td style="padding-top:10px;border-top:1px solid #e8dfa8;font-weight:700;color:#05391b;">Total</td>
          <td style="padding-top:10px;border-top:1px solid #e8dfa8;font-weight:700;color:#05391b;text-align:right;">€${subtotal.toFixed(2)}</td></tr>
    </table>
    <p style="color:#57684f;font-size:13px;line-height:1.5;margin:0;">
      Heating instructions for each dish are on the Orders page in the app.
    </p>`
  );

  const textLines = items.map((it) => `${it.quantity}x ${it.name} - EUR ${(it.unitPrice * it.quantity).toFixed(2)}`);
  const text = [
    'Your order is confirmed',
    `Delivery week of ${deliveryWeekStart}, ${deliveryDay === 'sun' ? 'Sunday' : 'Monday'}.`,
    '',
    ...textLines,
    '',
    `Total: EUR ${subtotal.toFixed(2)}`,
    '',
    'Heating instructions for each dish are on the Orders page in the app.',
  ].join('\n');

  await resend.emails.send({ from: FROM, to, subject: 'Your Fame order is confirmed', html, text });
}
