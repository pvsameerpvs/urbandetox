export const dynamic = 'force-dynamic';

import { getCorporatePage } from 'urbandetox-backend';

export default function CorporateRetreatsPage() {
  const page = getCorporatePage() as { title: string; content: string } | undefined;

  return (
    <div className="page-shell py-16 pb-24">
      <div className="spotlight-card max-w-4xl space-y-6">
        <p className="pill">Corporate retreats</p>
        <h1 className="font-display text-5xl text-white">{page?.title ?? 'Corporate Retreats'}</h1>
        <p className="text-base leading-8 text-white/72">{page?.content}</p>
      </div>
    </div>
  );
}
