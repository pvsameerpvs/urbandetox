import type { Destination, Package, Departure, SeasonalTag } from "@urbandetox/utils";
import { destinations as initialDestinations } from "@/data/destinations";
import { packages as initialPackages } from "@/data/packages";
import { departures as initialDepartures } from "@/data/departures";
import { initialSeasonalTags } from "@urbandetox/utils";

const DEST_KEY = "ud-admin-destinations";
const PKG_KEY = "ud-admin-packages";
const DEP_KEY = "ud-admin-departures";
const TAGS_KEY = "ud-admin-seasonal-tags";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

/* ─── Destinations ─────────────────────────── */
export function getDestinations(): Destination[] {
  return load(DEST_KEY, initialDestinations);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return getDestinations().find((d) => d.slug === slug);
}

export function createDestination(dest: Destination) {
  const all = getDestinations();
  all.push(dest);
  save(DEST_KEY, all);
}

export function updateDestination(slug: string, data: Partial<Destination>) {
  const all = getDestinations();
  const idx = all.findIndex((d) => d.slug === slug);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(DEST_KEY, all);
  }
}

export function deleteDestination(slug: string) {
  const all = getDestinations().filter((d) => d.slug !== slug);
  save(DEST_KEY, all);
}

/* ─── Packages ─────────────────────────────── */
export function getPackages(): Package[] {
  return load(PKG_KEY, initialPackages);
}

export function getPackageBySlug(slug: string): Package | undefined {
  return getPackages().find((p) => p.slug === slug);
}

export function getPackagesByDestination(destinationSlug: string): Package[] {
  return getPackages().filter((p) => p.destinationSlug === destinationSlug);
}

export function createPackage(pkg: Package) {
  const all = getPackages();
  if (all.some((p) => p.slug === pkg.slug)) return;
  all.push(pkg);
  save(PKG_KEY, all);
}

export function updatePackage(slug: string, data: Partial<Package>) {
  const all = getPackages();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data, slug }; // preserve original slug
    save(PKG_KEY, all);
  }
}

export function deletePackage(slug: string) {
  const all = getPackages().filter((p) => p.slug !== slug);
  save(PKG_KEY, all);
}

/* ─── Departures ─────────────────────────── */
export function getDepartures(): Departure[] {
  return load(DEP_KEY, initialDepartures);
}

export function getDepartureByCode(code: string): Departure | undefined {
  return getDepartures().find((d) => d.code === code);
}

export function createDeparture(dep: Departure) {
  const all = getDepartures();
  all.push(dep);
  save(DEP_KEY, all);
}

export function updateDeparture(id: string, data: Partial<Departure>) {
  const all = getDepartures();
  const idx = all.findIndex((d) => d.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(DEP_KEY, all);
  }
}

export function deleteDeparture(id: string) {
  const all = getDepartures().filter((d) => d.id !== id);
  save(DEP_KEY, all);
}

/* ─── Seasonal Tags ──────────────────────── */
export function getSeasonalTags(): SeasonalTag[] {
  return load(TAGS_KEY, initialSeasonalTags);
}

export function createSeasonalTag(tag: SeasonalTag) {
  const all = getSeasonalTags();
  all.push(tag);
  save(TAGS_KEY, all);
}

export function updateSeasonalTag(id: string, data: Partial<SeasonalTag>) {
  const all = getSeasonalTags();
  const idx = all.findIndex((t) => t.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(TAGS_KEY, all);
  }
}

export function deleteSeasonalTag(id: string) {
  const all = getSeasonalTags().filter((t) => t.id !== id);
  save(TAGS_KEY, all);
}

export function getPackagesUsingTag(tagName: string): number {
  return getPackages().filter((p) => p.seasonalTag === tagName).length;
}

