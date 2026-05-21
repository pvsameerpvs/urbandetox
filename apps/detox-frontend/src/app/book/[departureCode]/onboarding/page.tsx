import { notFound } from "next/navigation";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/api";
import { OnboardingPageClient } from "./OnboardingPageClient";

interface PageProps {
  params: Promise<{ departureCode: string }>;
}

export default async function OnboardingPage({ params }: PageProps) {
  const { departureCode } = await params;
  const departure = await fetchDepartureByCode(departureCode);
  const pkg = departure ? await fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? await fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  return <OnboardingPageClient code={departureCode} departure={departure} pkg={pkg} dest={dest} />;
}
