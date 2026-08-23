import type { Metadata } from "next";
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
    return {
      title: "Destination Not Found | Urban Detox",
    };
  }

  const title = dest.seoTitle || `${dest.name} Detox Retreats | Urban Detox`;
  const description = dest.seoDescription || dest.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: dest.image ? [dest.image] : undefined,
    },
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
