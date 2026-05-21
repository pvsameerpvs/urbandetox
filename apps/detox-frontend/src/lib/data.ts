import {
  destinations,
  getDestinationBySlug,
  packages,
  getPackageBySlug,
  getFeaturedPackages,
  getPackagesByDestination,
  getDeparturesByPackageSlug,
  getDepartureByCode,
  getUpcomingDepartures,
  getGuideBySlug,
  getFeaturedGuides,
  getAllGuides,
  getRelatedGuides,
  getGuideCategories,
  testimonials,
  getTestimonials,
  faqs,
  getAllFaqs,
  getFaqCategories,
  type Package,
  type Departure,
  type GuideArticle,
  type Destination,
} from "@urbandetox/utils";

// Local data layer — used by client components and as fallback.
// Server components should prefer lib/api.ts for backend integration.

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
