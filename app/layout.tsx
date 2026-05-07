import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VROOM — Real Cost of a Mercedes in Singapore',
  description:
    'Discover the true cost of owning a Mercedes-Benz in Singapore. Configure your E-Class, CLE Coupé, or Maybach S-Class with full COE, ARF, and running cost breakdowns.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-white min-h-screen">{children}</body>
    </html>
  );
}
