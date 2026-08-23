import { fetchGuides, fetchGuideCategories, fetchFeaturedGuides } from "@/lib/api";
import { GuideListingClient } from "./GuideListingClient";

import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";

/** Without this the route inherited the root title and had no canonical. */
export const metadata: Metadata = {
  title: "Travel Guide",
  description: clamp("Practical guides to travelling in South India: what to pack, when to go, how long to take and what a small-group trip is actually like."),
  ...routeSeo({ path: "/guide" }),
};

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
