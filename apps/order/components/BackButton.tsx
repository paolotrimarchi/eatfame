'use client';

import { useRouter } from 'next/navigation';

// The back affordance used to be a Link hardcoded to "/" or "/cart", which
// could send you somewhere you'd never been -- most visibly the dish page,
// reached from order history, whose "back" landed on an empty basket. This
// goes back to wherever you actually came from, falling back to a sensible
// destination on a cold load (e.g. someone opening a link directly).
export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  }

  return (
    <button type="button" onClick={goBack} className="back-fab" aria-label="Back">‹</button>
  );
}
