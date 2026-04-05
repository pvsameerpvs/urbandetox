import type { Metadata } from 'next';
import { Instrument_Sans, Newsreader } from 'next/font/google';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin-sidebar';
import './globals.css';

const instrumentSans = Instrument_Sans({ variable: '--font-sans', subsets: ['latin'] });
const newsreader = Newsreader({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UrbanDetox Admin',
  description: 'SQLite-backed admin dashboard for departures, participants, payments, and content.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instrumentSans.variable + ' ' + newsreader.variable}>
      <body>
        <div className="min-h-screen bg-[#fbf8f2] text-slate-900 lg:flex">
          <AdminSidebar />
          <div className="min-h-screen flex-1">
            <header className="border-b border-black/8 bg-[#fbf8f2]/95 px-6 py-4 backdrop-blur lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-slate-500">UrbanDetox admin</p>
                  <h1 className="font-display text-2xl text-slate-950">Shared SQLite control room</h1>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="http://localhost:3000" className="rounded-full border border-black/10 px-4 py-2 text-sm text-slate-700 transition hover:border-black/20 hover:bg-white">
                    Open website
                  </Link>
                </div>
              </div>
            </header>
            <main className="px-6 py-8 lg:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
