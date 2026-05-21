import type { Destination, Package, Departure, SeasonalTag } from "@urbandetox/utils";
import { destinationsApi } from "@/features/destinations";
import { packagesApi } from "@/features/packages";
import { departuresApi } from "@/features/departures";
import { seasonalTagsApi } from "@/features/seasonal-tags";

/* ─── Destinations (backward-compat wrappers) ─────────────────── */
export function getDestinations(): Destination[] {
  return destinationsApi.getAll();
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinationsApi.getBySlug(slug);
}

export function createDestination(dest: Destination) {
  destinationsApi.create(dest);
}

export function updateDestination(slug: string, data: Partial<Destination>) {
  destinationsApi.updateBySlug(slug, data);
}

export function deleteDestination(slug: string) {
  destinationsApi.deleteBySlug(slug);
}

/* ─── Packages (backward-compat wrappers) ──────────────────────── */
export function getPackages(): Package[] {
  return packagesApi.getAll();
}

export function getPackageBySlug(slug: string): Package | undefined {
  return packagesApi.getBySlug(slug);
}

export function getPackagesByDestination(destinationSlug: string): Package[] {
  return packagesApi.getByDestination(destinationSlug);
}

export function createPackage(pkg: Package) {
  packagesApi.create(pkg);
}

export function updatePackage(slug: string, data: Partial<Package>) {
  packagesApi.updateBySlug(slug, data);
}

export function deletePackage(slug: string) {
  packagesApi.deleteBySlug(slug);
}

/* ─── Departures (backward-compat wrappers) ──────────────────── */
export function getDepartures(): Departure[] {
  return departuresApi.getAll();
}

export function getDepartureByCode(code: string): Departure | undefined {
  return departuresApi.getByCode(code);
}

export function createDeparture(dep: Departure) {
  departuresApi.create(dep);
}

export function updateDeparture(id: string, data: Partial<Departure>) {
  departuresApi.update(id, data);
}

export function deleteDeparture(id: string) {
  departuresApi.delete(id);
}

/* ─── Seasonal Tags (backward-compat wrappers) ───────────────── */
export function getSeasonalTags(): SeasonalTag[] {
  return seasonalTagsApi.getAll();
}

export function createSeasonalTag(tag: SeasonalTag) {
  seasonalTagsApi.create(tag);
}

export function updateSeasonalTag(id: string, data: Partial<SeasonalTag>) {
  seasonalTagsApi.update(id, data);
}

export function deleteSeasonalTag(id: string) {
  seasonalTagsApi.delete(id);
}

export function getPackagesUsingTag(tagName: string): number {
  return packagesApi.countByTag(tagName);
}
