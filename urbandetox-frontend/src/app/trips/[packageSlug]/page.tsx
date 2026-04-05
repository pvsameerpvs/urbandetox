export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateRange, formatINR, getPackageDetailsBySlug } from 'urbandetox-backend';
import { SectionHeading } from '@/components/section-heading';

export default async function TripPackagePage({ params }: { params: Promise<{ packageSlug: string }> }) {
  const { packageSlug } = await params;
  const tripPackage = getPackageDetailsBySlug(packageSlug);

  if (!tripPackage) {
    notFound();
  }

  return (
    <div className="space-y-16 py-12 pb-24">
      <section className="page-shell">
        <div className="spotlight-card grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <span className="pill">{tripPackage.destination.name}</span>
            <div className="space-y-4">
              <h1 className="font-display text-5xl text-white sm:text-6xl">{tripPackage.defaultName}</h1>
              <p className="max-w-3xl text-base leading-8 text-white/70">{tripPackage.defaultDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              {tripPackage.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-white/10 px-4 py-2">{highlight}</span>
              ))}
            </div>
          </div>
          <div className="surface-card space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Default package shape</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Duration</p>
                <p className="mt-1 text-lg font-semibold text-white">{tripPackage.durationDays}D / {tripPackage.durationNights}N</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Difficulty</p>
                <p className="mt-1 text-lg font-semibold text-white">{tripPackage.difficultyLevel}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Meeting point</p>
              <p className="mt-2 text-sm leading-7 text-white/70">{tripPackage.defaultMeetingPoint}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell space-y-8">
        <SectionHeading eyebrow="Itinerary" title="The reusable package template." />
        <div className="grid gap-5 lg:grid-cols-3">
          {tripPackage.days.map((day) => (
            <article key={day.id} className="surface-card space-y-4">
              <span className="pill">Day {day.dayNumber}</span>
              <h2 className="font-display text-2xl text-white">{day.title}</h2>
              <p className="text-sm leading-7 text-white/65">{day.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell space-y-8">
        <SectionHeading eyebrow="Upcoming departures" title="Book the live batches, not the template." />
        <div className="grid gap-6 lg:grid-cols-2">
          {tripPackage.departures.map((departure) => (
            <article key={departure.id} className="surface-card space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="pill">{departure.tripCode}</span>
                <p className="text-xs uppercase tracking-[0.22em] text-white/35">{departure.fillRate}% filled</p>
              </div>
              <div>
                <h3 className="font-display text-3xl text-white">{departure.marketingTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-white/65">{departure.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Dates</p>
                  <p className="mt-1 text-white">{formatDateRange(departure.startDate, departure.endDate)}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Price</p>
                  <p className="mt-1 text-white">{formatINR(departure.offerPrice ?? departure.price)}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Available seats</p>
                  <p className="mt-1 text-white">{departure.availableSeats}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Guide</p>
                  <p className="mt-1 text-white">{departure.guideName ?? 'TBA'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={'/booking/' + departure.tripCode} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)]">
                  Reserve seats
                </Link>
                <Link href={'/trips/' + tripPackage.slug + '/' + departure.publicSlug} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35">
                  Open departure page
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
