export const dynamic = 'force-dynamic';

import { formatDate, listCheckinsAdmin } from 'urbandetox-backend';
import { recordCheckinAction } from '../../actions';

export default function CheckinPage() {
  const rows = listCheckinsAdmin();

  return (
    <div className="admin-card space-y-4">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Departure day ops</p>
        <h2 className="font-display text-3xl text-slate-950">Check-in board</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Traveler</th>
            <th>Trip</th>
            <th>Current</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.participantId}>
              <td>
                <div>
                  <p className="font-medium text-slate-950">{row.fullName}</p>
                  <p className="text-xs text-slate-500">{row.phone ?? 'Phone pending'}</p>
                </div>
              </td>
              <td>
                <div>
                  <p>{row.tripCode}</p>
                  <p className="text-xs text-slate-500">{row.marketingTitle}</p>
                </div>
              </td>
              <td>
                <div>
                  <p>{row.checkinStatus}</p>
                  <p className="text-xs text-slate-500">
                    {row.checkedInAt ? `Updated ${formatDate(row.checkedInAt)}` : 'No check-in yet'}
                  </p>
                </div>
              </td>
              <td>
                <form action={recordCheckinAction} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="participantId" value={row.participantId} />
                  <select name="status" defaultValue={row.checkinStatus} className="max-w-[11rem]">
                    <option value="pending">Pending</option>
                    <option value="checked_in">Checked in</option>
                    <option value="no_show">No show</option>
                  </select>
                  <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white" type="submit">
                    Save
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
