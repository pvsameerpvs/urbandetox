import { notFound } from "next/navigation";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug, fetchDeparturesByPackage } from "@/lib/api";
import { BookingPageClient } from "./BookingPageClient";

interface PageProps {
  params: Promise<{ departureCode: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { departureCode } = await params;
  const departure = await fetchDepartureByCode(departureCode);
  const pkg = departure ? await fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? await fetchDestinationBySlug(departure.destinationSlug) : undefined;
  const allDepartures = pkg ? await fetchDeparturesByPackage(pkg.slug) : [];

  if (!departure || !pkg || !dest) {
    notFound();
  }

  return (
    <BookingPageClient
      code={departureCode}
      departure={departure}
      pkg={pkg}
      dest={dest}
      allDepartures={allDepartures}
    />
  );
}
