import { notFound } from "next/navigation";
import { fetchDestinationBySlug, fetchPackagesByDestination, fetchUpcomingDepartures } from "@/lib/api";
import { DestinationHero } from "./components/DestinationHero";
import { DestinationPackages } from "./components/DestinationPackages";

interface PageProps {
  params: Promise<{ destinationSlug: string }>;
}

export default async function DestinationPage({ params }: PageProps) {
  const { destinationSlug } = await params;
  const dest = await fetchDestinationBySlug(destinationSlug);
  const packages = dest ? await fetchPackagesByDestination(destinationSlug) : [];
  const upcoming = await fetchUpcomingDepartures(50);

  if (!dest || packages.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <DestinationHero destination={dest} packageCount={packages.length} />
      <DestinationPackages destination={dest} packages={packages} upcoming={upcoming} />
    </main>
  );
}
