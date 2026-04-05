export const dynamic = 'force-dynamic';

import { listDestinationsAdmin, listTravelGuidesAdmin } from 'urbandetox-backend';
import { createTravelGuideAction } from '../../actions';

export default function TravelGuidesAdminPage() {
  const guides = listTravelGuidesAdmin();
  const destinations = listDestinationsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form action={createTravelGuideAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Create travel guide</h2>
        <select name="destinationId" defaultValue="">
          <option value="">No destination link</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>
        <input name="title" placeholder="Best time to do Kodai 3 Days" required />
        <textarea name="excerpt" rows={3} placeholder="Short intro for listing pages" required />
        <textarea name="content" rows={10} placeholder="Guide content" required />
        <select name="status" defaultValue="published">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save guide
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Travel guides</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => (
              <tr key={guide.id}>
                <td>
                  <div>
                    <p className="font-medium text-slate-950">{guide.title}</p>
                    <p className="text-xs text-slate-500">/{guide.slug}</p>
                  </div>
                </td>
                <td>{guide.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
