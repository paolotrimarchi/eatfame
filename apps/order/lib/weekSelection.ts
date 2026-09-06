// The delivery week is picked on Home, before browsing, so people know what
// date they're shopping for. Same localStorage + window-event pattern as the
// basket, so Home and the cart stay in sync without any global state library.
//
// Deliberately not marked 'use client' -- see the note at the top of cart.ts
// for why that matters if this ever gets imported from server code.

const KEY = 'fame_delivery_week_v1';
const DAY_KEY = 'fame_delivery_day_v1';

export const WEEK_CHANGED = 'fame-week-changed';

export function getSelectedWeek(): number {
  if (typeof window === 'undefined') return 0;
  const raw = Number(localStorage.getItem(KEY));
  return Number.isInteger(raw) && raw >= 0 ? raw : 0;
}

export function setSelectedWeek(index: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, String(index));
  window.dispatchEvent(new Event(WEEK_CHANGED));
}

export function getSelectedDay(): 'sun' | 'mon' {
  if (typeof window === 'undefined') return 'sun';
  return localStorage.getItem(DAY_KEY) === 'mon' ? 'mon' : 'sun';
}

export function setSelectedDay(day: 'sun' | 'mon') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAY_KEY, day);
  window.dispatchEvent(new Event(WEEK_CHANGED));
}
