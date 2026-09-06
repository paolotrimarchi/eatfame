// Offers the next few delivery weeks, each starting on a Sunday, skipping
// any week that's too close to promise. Mirrors the logic from the old
// fake-door site's weekStart(), minus the pinned launch date.
export const WEEK_COUNT = 4;
export const LEAD_DAYS = 2; // minimum notice before a drop

function isoLocal(d: Date) {
  const m = d.getMonth() + 1, day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`;
}

export function weekStart(i: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // jump to the next Sunday (or today, if today is Sunday)
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7));

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() + LEAD_DAYS);
  while (d < cutoff) d.setDate(d.getDate() + 7);

  d.setDate(d.getDate() + i * 7);
  return d;
}

export function weekOptions() {
  return Array.from({ length: WEEK_COUNT }, (_, i) => {
    const d = weekStart(i);
    return { index: i, iso: isoLocal(d), label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
  });
}

export function dayDate(weekIndex: number, day: 'sun' | 'mon') {
  const sun = weekStart(weekIndex);
  if (day === 'mon') sun.setDate(sun.getDate() + 1);
  return isoLocal(sun);
}
