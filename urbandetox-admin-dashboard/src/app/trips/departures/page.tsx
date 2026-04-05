export const dynamic = 'force-dynamic';

import { formatDateRange, formatINR, listDeparturesAdmin, listTripPackagesAdmin } from 'urbandetox-backend';
import { createDepartureAction } from '../../actions';

export default function DeparturesPage() {
  const packages = listTripPackagesAdmin();
  const departures = listDeparturesAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form action={createDepartureAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Create departure</h2>
        <select name="packageId" defaultValue="" required>
          <option value="" disabled>
            Select package template
          </option>
          {packages.map((tripPackage) => (
            <option key={tripPackage.id} value={tripPackage.id}>
              {tripPackage.defaultName}
            </option>
          ))}
        </select>
        <input name="marketingTitle" placeholder="Kodai April Reset" required />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="startDate" type="date" required />
          <input name="endDate" type="date" required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="price" type="number" min="0" defaultValue="6999" required />
          <input name="groupSizeMax" type="number" min="1" defaultValue="18" required />
        </div>
        <select name="visibilityStatus" defaultValue="published">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input type="checkbox" name="isFeatured" className="w-auto" />
          Mark as featured on the public home page
        </label>
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save departure
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Departure operations board</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Dates</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((departure) => (
              <tr key={departure.id}>
                <td>
                  <div>
                    <p className="font-medium text-slate-950">{departure.marketingTitle}</p>
                    <p className="text-xs text-slate-500">
                      {departure.tripCode} · {departure.destinationName}
                    </p>
                  </div>
                </td>
                <td>{formatDateRange(departure.startDate, departure.endDate)}</td>
                <td>{formatINR(departure.offerPrice ?? departure.price)}</td>
                <td>
                  <div>
                    <p>{departure.visibilityStatus}</p>
                    <p className="text-xs text-slate-500">{departure.availableSeats} seats open</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
