export const dynamic = 'force-dynamic';

import { listHomeBannersAdmin } from 'urbandetox-backend';
import { createBannerAction } from '../../actions';

export default function BannersPage() {
  const banners = listHomeBannersAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form action={createBannerAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Create banner</h2>
        <input name="title" placeholder="Headline" required />
        <textarea name="subtitle" rows={4} placeholder="Supporting copy" required />
        <input name="ctaLabel" placeholder="CTA label" required />
        <input name="ctaLink" placeholder="/trips" required />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">Add banner</button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Active banners</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>CTA</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.title}</td>
                <td>{banner.ctaLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
