"use client";

import { useParams, notFound } from "next/navigation";
import { fetchDestinationBySlug, fetchPackagesByDestination, fetchUpcomingDepartures } from "@/lib/data";
import { DestinationHero } from "./components/DestinationHero";
import { DestinationPackages } from "./components/DestinationPackages";

export default function DestinationPage() {
  const params = useParams();
  const slug = params.destinationSlug as string;
  const dest = fetchDestinationBySlug(slug);
  const packages = dest ? fetchPackagesByDestination(slug) : [];
  const upcoming = fetchUpcomingDepartures(50);

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
