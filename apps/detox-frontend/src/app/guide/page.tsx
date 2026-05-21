import { fetchGuides, fetchGuideCategories, fetchFeaturedGuides } from "@/lib/api";
import { GuideListingClient } from "./GuideListingClient";

export default async function GuideListingPage() {
  const guides = await fetchGuides();
  const categories = await fetchGuideCategories();
  const featuredList = await fetchFeaturedGuides(1);
  const featured = featuredList[0];

  return <GuideListingClient guides={guides} categories={categories} featured={featured} />;
}
