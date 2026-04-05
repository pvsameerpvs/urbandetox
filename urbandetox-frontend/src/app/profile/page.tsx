export const dynamic = 'force-dynamic';

import { formatINR, listCustomerTrips } from 'urbandetox-backend';

export default function ProfilePage() {
  const trips = listCustomerTrips('asha@example.com');

  return (
    <div className="page-shell space-y-8 py-16 pb-24">
      <div className="spotlight-card space-y-4">
        <p className="pill">Preview profile</p>
        <h1 className="font-display text-5xl text-white">A local customer dashboard without live auth yet.</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {trips.map((entry) => (
          <article key={entry.order.id} className="surface-card space-y-4">
            <h2 className="font-display text-3xl text-white">{entry.marketingTitle}</h2>
            <p className="text-sm leading-7 text-white/65">{entry.destinationName} · {entry.packageName}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/72">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Order total</p>
                <p className="mt-1 text-white">{formatINR(entry.order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Trip code</p>
                <p className="mt-1 text-white">{entry.tripCode}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
