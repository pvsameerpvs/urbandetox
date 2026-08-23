import type { Metadata } from "next";
import { SharedFormClient } from "./components/SharedFormClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Traveller Details | Urban Detox",
  description: "Add your traveller details for your upcoming Urban Detox trip.",
  // A share link is private to one booking, so keep it out of search results.
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedFormPage({ params }: PageProps) {
  const { token } = await params;
  return <SharedFormClient token={token} />;
}
