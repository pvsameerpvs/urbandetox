import Link from 'next/link';
import { formatDateRange, formatINR } from 'urbandetox-backend';

interface TripCardProps {
  packageSlug: string;
  destinationName: string;
  title: string;
  description: string;
  durationLabel: string;
  price: number | null;
  departureCount: number;
  nextDepartureDate: string | null;
}

export function TripCard({
  packageSlug,
  destinationName,
  title,
  description,
  durationLabel,
  price,
  departureCount,
  nextDepartureDate,
}: TripCardProps) {
  return (
    <article className="surface-card flex h-full flex-col justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="pill">{destinationName}</span>
          <span className="text-xs uppercase tracking-[0.24em] text-white/35">{durationLabel}</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{title}</h3>
          <p className="text-sm leading-7 text-white/65">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-white/72">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">From</p>
            <p className="mt-1 text-lg font-semibold text-white">{price ? formatINR(price) : 'Coming soon'}</p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Departures</p>
            <p className="mt-1 text-lg font-semibold text-white">{departureCount}</p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.22em] text-white/35">
          {nextDepartureDate ? 'Next batch: ' + formatDateRange(nextDepartureDate, nextDepartureDate) : 'Schedule coming soon'}
        </p>

        <Link
          href={'/trips/' + packageSlug}
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)]"
        >
          View package
        </Link>
      </div>
    </article>
  );
}
