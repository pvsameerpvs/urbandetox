import { notFound } from "next/navigation";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/api";
import { PaymentPageClient } from "./PaymentPageClient";

interface PageProps {
  params: Promise<{ departureCode: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { departureCode } = await params;
  const departure = await fetchDepartureByCode(departureCode);
  const pkg = departure ? await fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? await fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  return <PaymentPageClient code={departureCode} departure={departure} pkg={pkg} dest={dest} />;
}
