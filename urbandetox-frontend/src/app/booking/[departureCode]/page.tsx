export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { formatDateRange, formatINR, getDepartureByCode } from 'urbandetox-backend';
import { joinWaitlistAction, reserveDepartureAction } from '../actions';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ departureCode: string }>;
  searchParams: Promise<{ waitlist?: string }>;
}) {
  const { departureCode } = await params;
  const { waitlist } = await searchParams;
  const departure = getDepartureByCode(departureCode);

  if (!departure) {
    notFound();
  }

  return (
    <div className="page-shell grid gap-8 py-16 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-card space-y-6">
        <div>
          <p className="pill">Reserve seats</p>
          <h1 className="mt-4 font-display text-4xl text-white">{departure.marketingTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-white/65">This local build simulates payment instantly so we can test the booking and onboarding flow without a gateway.</p>
        </div>
        <form action={reserveDepartureAction} className="grid gap-4">
          <input type="hidden" name="departureCode" value={departure.tripCode} />
          <input type="hidden" name="companions" value="" />
          <label className="grid gap-2 text-sm text-white/75">
            Full name
            <input name="customerName" placeholder="Asha Nair" required />
          </label>
          <label className="grid gap-2 text-sm text-white/75">
            Phone
            <input name="phone" placeholder="+91 98765 11111" required />
          </label>
          <label className="grid gap-2 text-sm text-white/75">
            Email
            <input name="email" type="email" placeholder="asha@example.com" />
          </label>
          <label className="grid gap-2 text-sm text-white/75">
            Seats
            <select name="seatsRequested" defaultValue="1">
              <option value="1">1 seat</option>
              <option value="2">2 seats</option>
              <option value="3">3 seats</option>
              <option value="4">4 seats</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-white/75">
            Companion names
            <textarea name="companions" rows={3} placeholder="Friend 1, Friend 2" />
          </label>
          <button className="rounded-full bg-[var(--brand-sand)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white" type="submit">
            Reserve in preview mode
          </button>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="spotlight-card space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Departure snapshot</p>
          <div className="space-y-2">
            <h2 className="font-display text-3xl text-white">{departure.destinationName}</h2>
            <p className="text-sm leading-7 text-white/65">{formatDateRange(departure.startDate, departure.endDate)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Price</p>
              <p className="mt-1 text-white">{formatINR(departure.offerPrice ?? departure.price)}</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Available</p>
              <p className="mt-1 text-white">{departure.availableSeats}</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-white/65">Meeting point: {departure.meetingPoint}. Reporting time: {departure.reportingTime ?? 'TBA'}.</p>
        </div>

        <div className="surface-card space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Waitlist</p>
          {waitlist === 'joined' ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">You are on the waitlist for this batch.</p> : null}
          <form action={joinWaitlistAction} className="grid gap-3">
            <input type="hidden" name="departureId" value={departure.id} />
            <input type="hidden" name="departureCode" value={departure.tripCode} />
            <input name="name" placeholder="Your name" required />
            <input name="phone" placeholder="Phone number" required />
            <input name="email" type="email" placeholder="Email" />
            <textarea name="note" rows={3} placeholder="Seat preference or group note" />
            <button className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35" type="submit">
              Join waitlist
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
