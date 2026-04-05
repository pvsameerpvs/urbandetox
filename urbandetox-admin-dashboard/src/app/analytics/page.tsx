export const dynamic = 'force-dynamic';

import { formatINR, getAnalyticsSnapshot } from 'urbandetox-backend';

export default function AnalyticsPage() {
  const analytics = getAnalyticsSnapshot();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total revenue', value: formatINR(analytics.totalRevenue) },
          { label: 'Total bookings', value: analytics.totalBookings },
          { label: 'Website bookings', value: analytics.websiteBookings },
          { label: 'Manual bookings', value: analytics.manualBookings },
        ].map((card) => (
          <article key={card.label} className="admin-card">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
            <p className="mt-3 font-display text-4xl text-slate-950">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="admin-card space-y-4">
          <h2 className="font-display text-3xl text-slate-950">Top destinations</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topDestinations.map((destination) => (
                <tr key={destination.name}>
                  <td>{destination.name}</td>
                  <td>{formatINR(destination.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="admin-card space-y-4">
          <h2 className="font-display text-3xl text-slate-950">Booking source split</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {analytics.bookingSources.map((source) => (
                <tr key={source.source}>
                  <td>{source.source}</td>
                  <td>{source.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rounded-3xl bg-[#f8f5ef] p-4 text-sm text-slate-700">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Average fill rate</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{analytics.averageFillRate}%</p>
            <p className="mt-3">Waitlist potential currently sits at {analytics.waitlistConversionPotential} travelers.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
