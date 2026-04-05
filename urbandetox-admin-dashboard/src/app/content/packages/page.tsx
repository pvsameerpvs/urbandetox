export const dynamic = 'force-dynamic';

import { listDestinationsAdmin, listTripPackagesAdmin } from 'urbandetox-backend';
import { createPackageAction } from '../../actions';

export default function PackagesPage() {
  const packages = listTripPackagesAdmin();
  const destinations = listDestinationsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form action={createPackageAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Create package template</h2>
        <select name="destinationId" defaultValue="" required>
          <option value="" disabled>Select destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>{destination.name}</option>
          ))}
        </select>
        <input name="defaultName" placeholder="Kodai 3 Days" required />
        <input name="durationDays" type="number" min="1" defaultValue="2" required />
        <select name="category" defaultValue="weekend">
          <option value="weekend">Weekend</option>
          <option value="adventure">Adventure</option>
          <option value="student">Student</option>
          <option value="corporate">Corporate</option>
        </select>
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Create package</button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Package templates</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package</th>
              <th>Destination</th>
              <th>Departures</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((tripPackage) => (
              <tr key={tripPackage.id}>
                <td>{tripPackage.defaultName}</td>
                <td>{tripPackage.destinationName}</td>
                <td>{tripPackage.departureCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
