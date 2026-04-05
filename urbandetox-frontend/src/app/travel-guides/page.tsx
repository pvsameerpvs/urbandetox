export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listTravelGuides } from 'urbandetox-backend';

export default function TravelGuidesPage() {
  const guides = listTravelGuides();

  return (
    <div className="page-shell space-y-8 py-16 pb-24">
      <div className="spotlight-card space-y-4">
        <p className="pill">Travel guides</p>
        <h1 className="font-display text-5xl text-white">Destination pages with actual operational context.</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {guides.map((guide) => (
          <article key={guide.id} className="surface-card space-y-4">
            <h2 className="font-display text-3xl text-white">{guide.title}</h2>
            <p className="text-sm leading-7 text-white/65">{guide.excerpt}</p>
            <Link href={'/travel-guides/' + guide.slug} className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)]">
              Read guide
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
