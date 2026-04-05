export const dynamic = 'force-dynamic';

import { getUniversityPage } from 'urbandetox-backend';

export default function UniversityTripsPage() {
  const page = getUniversityPage() as { title: string; content: string } | undefined;

  return (
    <div className="page-shell py-16 pb-24">
      <div className="spotlight-card max-w-4xl space-y-6">
        <p className="pill">University trips</p>
        <h1 className="font-display text-5xl text-white">{page?.title ?? 'University Trips'}</h1>
        <p className="text-base leading-8 text-white/72">{page?.content}</p>
      </div>
    </div>
  );
}
