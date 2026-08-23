import { fetchGuides, fetchGuideCategories, fetchFeaturedGuides } from "@/lib/api";
import { GuideListingClient } from "./GuideListingClient";

export const dynamic = "force-dynamic";

export default async function GuideListingPage() {
  // Sequential unguarded awaits meant any one failure took the whole page to
  // the error boundary. Fetched together, each degrading on its own.
  const [guides, categories, featuredList] = await Promise.all([
    fetchGuides().catch(() => []),
    fetchGuideCategories().catch(() => []),
    fetchFeaturedGuides(1).catch(() => []),
  ]);
  const featured = featuredList[0];

  return <GuideListingClient guides={guides} categories={categories} featured={featured} />;
}
