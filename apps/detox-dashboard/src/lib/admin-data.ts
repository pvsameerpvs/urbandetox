import type { Destination, Package, Departure } from "@urbandetox/utils";
import { destinations as initialDestinations } from "@/data/destinations";
import { packages as initialPackages } from "@/data/packages";
import { departures as initialDepartures } from "@/data/departures";

const DEST_KEY = "ud-admin-destinations";
const PKG_KEY = "ud-admin-packages";
const DEP_KEY = "ud-admin-departures";

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

export function getDeparturesByPackage(packageSlug: string): Departure[] {
  return getDepartures().filter((d) => d.packageSlug === packageSlug);
}

export function getUpcomingDepartures(limit = 50): Departure[] {
  const today = new Date().toISOString().split("T")[0];
  return getDepartures()
    .filter((d) => d.startDate >= today && d.status !== "closed")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
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


