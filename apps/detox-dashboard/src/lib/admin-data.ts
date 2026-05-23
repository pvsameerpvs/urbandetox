import type { Destination, Package, Departure, SeasonalTag } from "@urbandetox/utils";
import {
  fetchDestinations,
  fetchPackages,
  fetchDepartures,
  fetchSeasonalTags,
  createDestination as apiCreateDestination,
  updateDestination as apiUpdateDestination,
  deleteDestination as apiDeleteDestination,
  createPackage as apiCreatePackage,
  updatePackage as apiUpdatePackage,
  deletePackage as apiDeletePackage,
  createDeparture as apiCreateDeparture,
  updateDeparture as apiUpdateDeparture,
  deleteDeparture as apiDeleteDeparture,
  createSeasonalTag as apiCreateSeasonalTag,
  updateSeasonalTag as apiUpdateSeasonalTag,
  deleteSeasonalTag as apiDeleteSeasonalTag,
} from "@/lib/api";

/* ─── Destinations ─────────────────────────── */
export async function getDestinations(): Promise<Destination[]> {
  return fetchDestinations<Destination>();
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  try {
    const all = await getDestinations();
    return all.find((d) => d.slug === slug);
  } catch {
    return undefined;
  }
}

export async function createDestination(dest: Destination): Promise<void> {
  await apiCreateDestination(dest);
}

export async function updateDestination(slug: string, data: Partial<Destination>): Promise<void> {
  await apiUpdateDestination(slug, data);
}

export async function deleteDestination(slug: string): Promise<void> {
  await apiDeleteDestination(slug);
}

/* ─── Packages ─────────────────────────────── */
export async function getPackages(): Promise<Package[]> {
  return fetchPackages<Package>();
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  try {
    const all = await getPackages();
    return all.find((p) => p.slug === slug);
  } catch {
    return undefined;
  }
}

export function getPackagesByDestination(_destinationSlug: string): Promise<Package[]> {
  return fetchPackages<Package>();
}

export async function createPackage(pkg: Package): Promise<void> {
  await apiCreatePackage(pkg);
}

export async function updatePackage(slug: string, data: Partial<Package>): Promise<void> {
  await apiUpdatePackage(slug, data);
}

export async function deletePackage(slug: string): Promise<void> {
  await apiDeletePackage(slug);
}

/* ─── Departures ─────────────────────────── */
export async function getDepartures(): Promise<Departure[]> {
  return fetchDepartures<Departure>();
}

export async function getDepartureByCode(code: string): Promise<Departure | undefined> {
  try {
    const all = await getDepartures();
    return all.find((d) => d.code === code);
  } catch {
    return undefined;
  }
}

export async function createDeparture(dep: Departure): Promise<void> {
  await apiCreateDeparture(dep);
}

export async function updateDeparture(id: string, data: Partial<Departure>): Promise<void> {
  await apiUpdateDeparture(id, data);
}

export async function deleteDeparture(id: string): Promise<void> {
  await apiDeleteDeparture(id);
}

/* ─── Seasonal Tags ──────────────────────── */
export async function getSeasonalTags(): Promise<SeasonalTag[]> {
  return fetchSeasonalTags<SeasonalTag>();
}

export async function createSeasonalTag(tag: SeasonalTag): Promise<void> {
  await apiCreateSeasonalTag(tag);
}

export async function updateSeasonalTag(id: string, data: Partial<SeasonalTag>): Promise<void> {
  await apiUpdateSeasonalTag(id, data);
}

export async function deleteSeasonalTag(id: string): Promise<void> {
  await apiDeleteSeasonalTag(id);
}

export async function getPackagesUsingTag(tagName: string): Promise<number> {
  const all = await getPackages();
  return all.filter((p) => p.seasonalTag === tagName).length;
}
