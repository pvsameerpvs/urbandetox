import { notFound } from "next/navigation";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/api";
import { PackageDetailClient } from "./PackageDetailClient";

interface PageProps {
  params: Promise<{ destinationSlug: string; packageSlug: string }>;
}

export default async function DetoxDetailPage({ params }: PageProps) {
  const { destinationSlug, packageSlug } = await params;

  const pkg = await fetchPackageBySlug(packageSlug);
  const dest = pkg ? await fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  const departures = pkg ? await fetchDeparturesByPackage(pkg.slug) : [];
  const guides = pkg ? (await fetchGuides()).filter((g) => g.destinationSlug === pkg.destinationSlug).slice(0, 3) : [];

  // Validate: URL destinationSlug must match package's actual destination
  if (!pkg || !dest || dest.slug !== destinationSlug) {
    notFound();
  }

  return <PackageDetailClient pkg={pkg} dest={dest} departures={departures} guides={guides} />;
}
