// Shared formatting so prices and dates read the same everywhere. Dutch
// convention for money ("€ 16,00"), and real dates rather than ISO strings or
// "w/c" notation, which nobody thinks in.

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

export function euro(amount: number) {
  return eur.format(amount);
}

// "Sunday 6 September"
export function longDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// "Sun 6 Sept"
export function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// "6 Sept"
export function dayMonth(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

// "3 Sept 2026" -- for "ordered on" lines, where the year matters
export function placedDate(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Short human-readable reference from the order's uuid, so two orders for the
// same week are tellable apart and support can find one.
export function orderRef(id: string) {
  return id.replace(/-/g, '').slice(0, 6).toUpperCase();
}
