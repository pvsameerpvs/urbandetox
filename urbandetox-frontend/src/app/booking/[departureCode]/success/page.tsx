export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateRange, formatINR, getBookingSuccessSnapshot } from 'urbandetox-backend';

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ departureCode: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { departureCode } = await params;
  const { order } = await searchParams;
  const snapshot = order ? getBookingSuccessSnapshot(order) : null;

  if (!snapshot || snapshot.departure.tripCode !== departureCode) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8 py-16 pb-24">
      <div className="spotlight-card space-y-6">
        <p className="pill">Reservation recorded</p>
        <div>
          <h1 className="font-display text-5xl text-white">Booking locked in preview mode.</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-white/70">
            Your local preview payment has been recorded and participant rows were created in SQLite. Next step: finish onboarding.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Departure</p>
            <p className="mt-2 text-white">{snapshot.departure.tripCode}</p>
          </div>
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Dates</p>
            <p className="mt-2 text-white">{formatDateRange(snapshot.departure.startDate, snapshot.departure.endDate)}</p>
          </div>
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Amount</p>
            <p className="mt-2 text-white">{snapshot.payment ? formatINR(snapshot.payment.amount) : formatINR(snapshot.order.totalAmount)}</p>
          </div>
          <div className="surface-card">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Travelers</p>
            <p className="mt-2 text-white">{snapshot.participants.length}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={'/booking/' + departureCode + '/onboarding?participant=' + snapshot.participants[0].id} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)]">
            Continue onboarding
          </Link>
          <Link href={'/trips/' + snapshot.departure.packageSlug} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35">
            Back to trip page
          </Link>
        </div>
      </div>
    </div>
  );
}
