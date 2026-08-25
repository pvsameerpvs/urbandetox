import type { Metadata } from "next";
import { clamp, dbTitle, routeSeo } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { fetchDestinationBySlug, fetchPackagesByDestination, fetchUpcomingDepartures } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildDestinationNode } from "@/lib/seo/destination";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { DestinationHero } from "./components/DestinationHero";
import { DestinationPackages } from "./components/DestinationPackages";

interface PageProps {
  params: Promise<{ destinationSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destinationSlug } = await params;
  const dest = await fetchDestinationBySlug(destinationSlug);

  if (!dest) {
    return { title: "Destination not found", robots: { index: false, follow: false } };
  }

  // dbTitle returns { absolute } when the DB value already contains the brand,
  // which every destination row does, so the root template does not double it.
  const title = dbTitle(dest.seoTitle, `${dest.name} Detox Retreats`);

  /**
   * Goes through routeSeo like every other route.
   *
   * This block used to hand-roll its metadata and return no `alternates` at
   * all, so all 16 destination pages inherited the root layout's
   * canonical: "/" and told Google they were duplicates of the homepage. That
   * is a deindexing bug across a third of the indexable URLs, and it only
   * appeared when the root canonical was added: before that these pages simply
   * had none, which is harmless.
   *
   * The hand-rolled openGraph also replaced the root object wholesale, so these
   * pages silently lost og:site_name, og:locale and og:url.
   */
  return {
    title,
    description: clamp(dest.seoDescription || dest.description),
    ...routeSeo({
      path: `/detox/${dest.slug}`,
      image: dest.image,
      imageAlt: dest.imageAlt || dest.name,
    }),
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { destinationSlug } = await params;
  const dest = await fetchDestinationBySlug(destinationSlug);
  const packages = dest ? await fetchPackagesByDestination(destinationSlug) : [];
  const upcoming = await fetchUpcomingDepartures(50);

  if (!dest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <JsonLd
        id="ld-destination"
        nodes={[
          ...buildDestinationNode(dest, packages),
          buildBreadcrumbNode(`/detox/${dest.slug}`, [
            { name: "Home", path: "/" },
            { name: "Explore Detox", path: "/detox" },
            { name: dest.name, path: `/detox/${dest.slug}` },
          ]),
        ]}
      />
      <DestinationHero destination={dest} packageCount={packages.length} />
      {packages.length > 0 && (
        <DestinationPackages destination={dest} packages={packages} upcoming={upcoming} />
      )}
    </div>
  );
}
