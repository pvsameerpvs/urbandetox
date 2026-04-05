export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateRange, formatINR, getDepartureByPackageAndSlug } from 'urbandetox-backend';

export default async function DeparturePage({ params }: { params: Promise<{ packageSlug: string; departureSlug: string }> }) {
  const { packageSlug, departureSlug } = await params;
  const departure = getDepartureByPackageAndSlug(packageSlug, departureSlug);

  if (!departure) {
    notFound();
  }

  return (
    <div className="page-shell space-y-10 py-16 pb-24">
      <div className="spotlight-card grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <span className="pill">{departure.tripCode}</span>
          <div>
            <h1 className="font-display text-5xl text-white">{departure.marketingTitle}</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/72">{departure.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Dates</p>
              <p className="mt-1 text-white">{formatDateRange(departure.startDate, departure.endDate)}</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Destination</p>
              <p className="mt-1 text-white">{departure.destinationName}</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Available seats</p>
              <p className="mt-1 text-white">{departure.availableSeats}</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Guide</p>
              <p className="mt-1 text-white">{departure.guideName ?? 'TBA'}</p>
            </div>
          </div>test
        </div>
        <div className="surface-card space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Pricing</p>
          <p className="font-display text-5xl text-white">{formatINR(departure.offerPrice ?? departure.price)}</p>
          <p className="text-sm leading-7 text-white/65">Meeting point: {departure.meetingPoint}. Reporting time: {departure.reportingTime ?? 'TBA'}.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={'/booking/' + departure.tripCode} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)]">
              Reserve now
            </Link>
            <Link href={'/trips/' + departure.packageSlug} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35">
              Back to package
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
