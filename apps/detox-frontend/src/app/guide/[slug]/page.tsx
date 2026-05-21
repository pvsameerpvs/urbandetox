import { notFound } from "next/navigation";
import { fetchGuideBySlug, fetchRelatedGuides, fetchDestinationBySlug, fetchPackageBySlug } from "@/lib/api";
import { GuideHero } from "./components/GuideHero";
import { GuideContent } from "./components/GuideContent";
import { RelatedPackageCard } from "./components/RelatedPackageCard";
import { RelatedGuideCard } from "./components/RelatedGuideCard";
import { GuideCTA } from "./components/GuideCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await fetchGuideBySlug(slug);

  if (!guide) notFound();

  const dest = guide.destinationSlug ? await fetchDestinationBySlug(guide.destinationSlug) : undefined;
  const related = await fetchRelatedGuides(guide.slug, 3);

  // Fetch related packages data on server
  const relatedPackages = guide.relatedPackageSlugs
    ? await Promise.all(guide.relatedPackageSlugs.map(async (s) => {
        const pkg = await fetchPackageBySlug(s);
        const d = pkg ? await fetchDestinationBySlug(pkg.destinationSlug) : undefined;
        return { pkg, dest: d };
      }))
    : [];

  return (
    <main className="min-h-screen bg-white">
      <GuideHero
        title={guide.title}
        excerpt={guide.excerpt}
        category={guide.category}
        image={guide.image}
        destName={dest?.name}
        featured={guide.featured}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <GuideContent content={guide.content} />

        {relatedPackages.length > 0 && (
          <div className="mt-14 sm:mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-brand/60" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Book This Trip</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Related Detox Packages</h2>
            <div className="grid grid-cols-1 gap-4">
              {relatedPackages.map(({ pkg, dest: d }) =>
                pkg ? <RelatedPackageCard key={pkg.slug} pkg={pkg} dest={d} /> : null
              )}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-14 sm:mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-brand/60" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Keep Reading</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">More Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((g) => (
                <RelatedGuideCard key={g.id} guide={g} />
              ))}
            </div>
          </div>
        )}

        <GuideCTA />
      </div>
    </main>
  );
}
