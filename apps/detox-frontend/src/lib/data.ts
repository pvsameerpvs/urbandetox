import { Package, Departure, GuideArticle, Destination } from "@urbandetox/utils";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { getPackageBySlug, getFeaturedPackages, getPackagesByDestination } from "@/data/packages";
import { getDeparturesByPackageSlug, getDepartureByCode, getUpcomingDepartures } from "@/data/departures";
import { getGuideBySlug, getFeaturedGuides, getAllGuides, getRelatedGuides, getGuideCategories } from "@urbandetox/utils";
import { testimonials, getTestimonials } from "@/data/testimonials";
import { faqs, getAllFaqs, getFaqCategories } from "@/data/faqs";

// This is the smart data layer.
// Later, replace these functions with Supabase / API calls.
// Components stay unchanged.

export function fetchDestinations(): Destination[] {
  return destinations;
}

export function fetchDestinationBySlug(slug: string): Destination | undefined {
  return getDestinationBySlug(slug);
}

export function fetchPackageBySlug(slug: string): Package | undefined {
  return getPackageBySlug(slug);
}

export function fetchPackagesByDestination(destinationSlug: string): Package[] {
  return getPackagesByDestination(destinationSlug);
}

export function fetchFeaturedPackages(): Package[] {
  return getFeaturedPackages();
}

export function fetchDeparturesByPackage(packageSlug: string): Departure[] {
  return getDeparturesByPackageSlug(packageSlug);
}

export function fetchDepartureByCode(code: string): Departure | undefined {
  return getDepartureByCode(code);
}

export function fetchUpcomingDepartures(limit = 6): Departure[] {
  return getUpcomingDepartures(limit);
}

export function fetchGuides(): GuideArticle[] {
  return getAllGuides();
}

export function fetchGuideBySlug(slug: string): GuideArticle | undefined {
  return getGuideBySlug(slug);
}

export function fetchFeaturedGuides(limit = 4): GuideArticle[] {
  return getFeaturedGuides(limit);
}

export function fetchRelatedGuides(currentSlug: string, limit = 3): GuideArticle[] {
  return getRelatedGuides(currentSlug, limit);
}

export function fetchGuideCategories(): string[] {
  return getGuideCategories();
}

export function fetchTestimonials(limit = 4): typeof testimonials {
  return getTestimonials(limit);
}

export function fetchFaqCategories(): string[] {
  return getFaqCategories();
}

export function fetchAllFaqs(): typeof faqs {
  return getAllFaqs();
}
