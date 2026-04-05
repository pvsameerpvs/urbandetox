import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'UrbanDetox — Curated Weekend Escapes',
    template: '%s | UrbanDetox',
  },
  description:
    'Discover handpicked weekend trips, treks, and retreats across South India. Book your next escape with UrbanDetox.',
  keywords: ['weekend trips', 'South India travel', 'Kodaikanal', 'Gokarna', 'group travel', 'weekend getaway'],
  openGraph: {
    title: 'UrbanDetox — Curated Weekend Escapes',
    description: 'Handpicked treks, retreats and escapes across South India.',
    type: 'website',
    siteName: 'UrbanDetox',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <div className="page-frame">
          <SiteHeader />
          <main style={{ flex: 1 }}>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

