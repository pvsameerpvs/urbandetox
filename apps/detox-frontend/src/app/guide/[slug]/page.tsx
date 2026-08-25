import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGuideBySlug, fetchRelatedGuides, fetchDestinationBySlug, fetchPackageBySlug } from "@/lib/api";
import { clamp, dbTitle, routeSeo } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleNode } from "@/lib/seo/article";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { GuideHero } from "./components/GuideHero";
import { GuideContent } from "./components/GuideContent";
import { RelatedPackageCard } from "./components/RelatedPackageCard";
import { RelatedGuideCard } from "./components/RelatedGuideCard";
import { GuideCTA } from "./components/GuideCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Without this every guide URL inherited the root layout's title and
 * description, so all nine looked identical to a crawler and to anyone pasting
 * a link into WhatsApp. dbTitle marks a DB value absolute when it already
 * carries the brand, so the root title.template cannot double-brand it.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await fetchGuideBySlug(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };

  return {
    title: dbTitle(guide.seoTitle, guide.title),
    description: clamp(guide.seoDescription || guide.excerpt),
    ...routeSeo({
      // Editorial content with an Article node, so og:type is article, not
      // the website default.
      type: "article",
      path: `/guide/${guide.slug}`,
      image: guide.image,
      imageAlt: guide.imageAlt || guide.title,
    }),
  };
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
    <div className="min-h-screen bg-white">
      <JsonLd
        id="ld-guide"
        nodes={[
          buildArticleNode(guide, dest),
          buildBreadcrumbNode(`/guide/${guide.slug}`, [
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guide" },
            { name: guide.title, path: `/guide/${guide.slug}` },
          ]),
        ]}
      />
      <GuideHero
        title={guide.title}
        excerpt={guide.excerpt}
        content={guide.content}
        imageAlt={guide.imageAlt}
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
    </div>
  );
}
