import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
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

const superbusyRegular = localFont({
  src: '../fonts/SuperbusyActivity-Regular.woff2',
  variable: '--font-superbusy-regular',
  display: 'swap',
});

const superbusyText = localFont({
  src: '../fonts/Superbusy Activity Text.woff2',
  variable: '--font-superbusy-text',
  display: 'swap',
});

const superbusyOutline = localFont({
  src: '../fonts/SuperbusyActivity-Outline.woff2',
  variable: '--font-superbusy-outline',
  display: 'swap',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${superbusyRegular.variable} ${superbusyText.variable} ${superbusyOutline.variable}`}>
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
