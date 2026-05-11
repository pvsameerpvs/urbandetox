import { destinations } from "../data/destinations";
import { packages } from "../data/packages";
import { departures } from "../data/departures";

export function fetchDestinations() { return destinations; }
export function fetchDestinationBySlug(slug: string) { return destinations.find((d) => d.slug === slug); }
export function fetchPackages() { return packages; }
export function fetchPackageBySlug(slug: string) { return packages.find((p) => p.slug === slug); }
export function fetchPackagesByDestination(destinationSlug: string) { return packages.filter((p) => p.destinationSlug === destinationSlug); }
export function fetchFeaturedPackages() { return packages.filter((p) => p.featured); }
export function fetchDepartures() { return departures; }
export function fetchDeparturesByPackage(packageSlug: string) { return departures.filter((d) => d.packageSlug === packageSlug); }
export function fetchUpcomingDepartures(limit = 50) {
  const today = new Date().toISOString().split("T")[0];
  return departures
    .filter((d) => d.startDate >= today && d.status !== "closed")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}
