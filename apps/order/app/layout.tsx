import type { Metadata } from 'next';
import BottomNav from '@/components/BottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fame · Order',
  description: 'Order dishes from Amsterdam restaurants you already love.',
};

// No persistent top header on any page -- the brand mark only appears on the
// home page itself, and inner pages get a small floating back button instead.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
