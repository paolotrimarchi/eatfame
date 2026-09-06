'use client';

import { useEffect, useState } from 'react';
import { weekOptions, dayDate, LEAD_DAYS } from '@/lib/weeks';
import { getSelectedWeek, setSelectedWeek, WEEK_CHANGED } from '@/lib/weekSelection';
import { shortDate } from '@/lib/format';

// Sits at the top of Home in place of the old "order for any of the next few
// weeks" banner. Choosing the week before browsing is the whole point -- it
// tells you what date you're shopping for while you pick, instead of only
// finding out at checkout.
export default function WeekPicker() {
  const [week, setWeek] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setWeek(getSelectedWeek());
    refresh();
    window.addEventListener(WEEK_CHANGED, refresh);
    return () => window.removeEventListener(WEEK_CHANGED, refresh);
  }, []);

  const options = weekOptions();
  // Render nothing on the first pass rather than flashing week 0 as selected
  // before localStorage has been read.
  const selected = week ?? 0;

  return (
    <div className="wrap" style={{ margin: '4px 0 18px' }}>
      <div className="sub-h" style={{ margin: '0 0 8px' }}>Delivering</div>
      <div className="weekbar">
        {options.map((w) => (
          <button
            key={w.index}
            className={`wk ${week !== null && selected === w.index ? 'sel' : ''}`}
            onClick={() => setSelectedWeek(w.index)}
          >
            <b>{shortDate(dayDate(w.index, 'sun')).split(' ')[0]}</b>
            <span>{w.label}</span>
          </button>
        ))}
      </div>
      <p className="muted" style={{ margin: '8px 0 0', fontSize: 12.5 }}>
        Sunday or Monday delivery, your pick at checkout. Orders close {LEAD_DAYS} days before.
      </p>
    </div>
  );
}
