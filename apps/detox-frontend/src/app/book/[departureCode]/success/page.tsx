import { notFound } from "next/navigation";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/api";
import { SuccessPageClient } from "./SuccessPageClient";

interface PageProps {
  params: Promise<{ departureCode: string }>;
}

export default async function SuccessPage({ params }: PageProps) {
  const { departureCode } = await params;
  const departure = await fetchDepartureByCode(departureCode);
  const pkg = departure ? await fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? await fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  return <SuccessPageClient departure={departure} pkg={pkg} dest={dest} />;
}
