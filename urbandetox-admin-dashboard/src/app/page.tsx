export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { formatINR, getAnalyticsSnapshot, getDashboardMetrics, listDeparturesAdmin } from 'urbandetox-backend';

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const departures = listDeparturesAdmin().slice(0, 4);
  const analytics = getAnalyticsSnapshot();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Upcoming departures', value: metrics.upcomingDepartures },
          { label: 'Seats sold this month', value: metrics.seatsSoldThisMonth },
          { label: 'Revenue this month', value: formatINR(metrics.revenueThisMonth) },
          { label: 'Pending forms', value: metrics.pendingForms },
        ].map((metric) => (
          <article key={metric.label} className="admin-card">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
            <p className="mt-3 font-display text-4xl text-slate-950">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="admin-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Departure pipeline</p>
              <h2 className="font-display text-3xl text-slate-950">Live batches and seat health</h2>
            </div>
            <Link href="/trips/departures" className="rounded-full border border-black/10 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Manage departures</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Trip</th>
                <th>Destination</th>
                <th>Available</th>
                <th>Fill rate</th>
              </tr>
            </thead>
            <tbody>
              {departures.map((departure) => (
                <tr key={departure.id}>
                  <td>
                    <div>
                      <p className="font-medium text-slate-950">{departure.marketingTitle}</p>
                      <p className="text-xs text-slate-500">{departure.tripCode}</p>
                    </div>
                  </td>
                  <td>{departure.destinationName}</td>
                  <td>{departure.availableSeats}</td>
                  <td>{departure.fillRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="admin-card space-y-4">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Analytics pulse</p>
          <h2 className="font-display text-3xl text-slate-950">Business snapshot</h2>
          <div className="grid gap-4 text-sm text-slate-700">
            <div className="rounded-3xl bg-[#f8f5ef] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Total revenue</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{formatINR(analytics.totalRevenue)}</p>
            </div>
            <div className="rounded-3xl bg-[#f8f5ef] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Average fill rate</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{analytics.averageFillRate}%</p>
            </div>
            <div className="rounded-3xl bg-[#f8f5ef] p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Waitlist demand</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{analytics.waitlistConversionPotential}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
