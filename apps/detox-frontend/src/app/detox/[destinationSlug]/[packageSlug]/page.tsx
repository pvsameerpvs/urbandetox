import { notFound } from "next/navigation";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/api";
import { PackageDetailClient } from "./components/PackageDetailClient";

interface PageProps {
  params: Promise<{ destinationSlug: string; packageSlug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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

  return <PackageDetailClient pkg={pkg} dest={dest} departures={departures} guides={guides} selectedDepartureCode={selectedDepartureCode} />;
}
