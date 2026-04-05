export const dynamic = 'force-dynamic';

import { listDestinationsAdmin } from 'urbandetox-backend';
import { createDestinationAction } from '../../actions';

export default function DestinationsPage() {
  const destinations = listDestinationsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form action={createDestinationAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Add destination</h2>
        <input name="name" placeholder="Kodaikanal" required />
        <input name="region" placeholder="Tamil Nadu Hills" required />
        <textarea name="shortDescription" rows={4} placeholder="Short destination summary" required />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Save destination</button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Destination library</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id}>
                <td>{destination.name}</td>
                <td>{destination.region}</td>
                <td>{destination.isActive ? 'Active' : 'Hidden'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
