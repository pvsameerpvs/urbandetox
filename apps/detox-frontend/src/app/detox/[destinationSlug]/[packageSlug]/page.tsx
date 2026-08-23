import type { Metadata } from "next";
import { clamp, dbTitle, routeSeo } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/api";
import { selectVisibleDepartures } from "@/lib/departure-visibility";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTouristTripNode, packagePath } from "@/lib/seo/trip";
import { buildDepartureEventNodes } from "@/lib/seo/departure";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { buildFaqPageNode } from "@/lib/seo/faq";
import { PackageDetailClient } from "./components/PackageDetailClient";

interface PageProps {
  params: Promise<{ destinationSlug: string; packageSlug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * The 17 trip URLs are the most commercially valuable pages on the site and
 * every one of them was serving the root layout's title and description, so
 * they were indistinguishable in search results and had no og:image.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destinationSlug, packageSlug } = await params;
  const pkg = await fetchPackageBySlug(packageSlug);
  if (!pkg) return { title: "Trip not found", robots: { index: false, follow: false } };
  const dest = await fetchDestinationBySlug(destinationSlug);

  const fallback = dest ? `${pkg.title} | ${dest.name}` : pkg.title;
  /**
   * Guard against a trip inheriting the identical seo_title as its destination.
   * Sixteen of seventeen rows did exactly that, which turned 32 URLs into 16
   * duplicate-title pairs. If the values match, the computed trip title wins.
   */
  const clashesWithDestination =
    !!pkg.seoTitle && !!dest?.seoTitle && pkg.seoTitle.trim() === dest.seoTitle.trim();

  return {
    title: dbTitle(clashesWithDestination ? null : pkg.seoTitle, fallback),
    description: clamp(pkg.seoDescription || pkg.subtitle || pkg.title),
    ...routeSeo({
      path: `/detox/${destinationSlug}/${pkg.slug}`,
      image: pkg.coverImage,
      imageAlt: pkg.title,
    }),
  };
}

export default async function DetoxDetailPage({ params, searchParams }: PageProps) {
  const { destinationSlug, packageSlug } = await params;
  const query = searchParams ? await searchParams : {};
  const selectedDepartureCode = typeof query.departure === "string" ? query.departure : undefined;

  const pkg = await fetchPackageBySlug(packageSlug);
  const dest = pkg ? await fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  const departures = pkg ? await fetchDeparturesByPackage(pkg.slug) : [];
  const guides = pkg ? (await fetchGuides()).filter((g) => g.destinationSlug === pkg.destinationSlug).slice(0, 3) : [];

  // Validate: URL destinationSlug must match package's actual destination
  if (!pkg || !dest || dest.slug !== destinationSlug) {
    notFound();
  }

  // Same list the page renders, so no Event node describes a hidden departure.
  const visibleDepartures = selectVisibleDepartures(departures, selectedDepartureCode);
  const path = packagePath(pkg);

  return (
    <>
      <JsonLd
        id="ld-package"
        nodes={[
          buildTouristTripNode(pkg, dest),
          ...buildDepartureEventNodes(pkg, dest, visibleDepartures),
          buildBreadcrumbNode(path, [
            { name: "Home", path: "/" },
            { name: "Explore Detox", path: "/detox" },
            { name: dest.name, path: `/detox/${dest.slug}` },
            { name: pkg.title, path },
          ]),
          buildFaqPageNode(path, pkg.faqs ?? []),
        ]}
      />
      <PackageDetailClient pkg={pkg} dest={dest} departures={departures} guides={guides} selectedDepartureCode={selectedDepartureCode} />
    </>
  );
}
