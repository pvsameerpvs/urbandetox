import { destinations as initialDestinations } from "../data/destinations";
import { packages as initialPackages } from "../data/packages";
import { departures as initialDepartures } from "../data/departures";

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
export function getDestinations() {
  return load(DEST_KEY, initialDestinations);
}

export function getDestinationBySlug(slug: string) {
  return getDestinations().find((d: { slug: string }) => d.slug === slug);
}

export function createDestination(dest: Record<string, unknown>) {
  const all = getDestinations() as Record<string, unknown>[];
  all.push(dest);
  save(DEST_KEY, all);
}

export function updateDestination(slug: string, data: Record<string, unknown>) {
  const all = getDestinations() as Record<string, unknown>[];
  const idx = all.findIndex((d) => (d as { slug: string }).slug === slug);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(DEST_KEY, all);
  }
}

export function deleteDestination(slug: string) {
  const all = (getDestinations() as Record<string, unknown>[]).filter((d) => (d as { slug: string }).slug !== slug);
  save(DEST_KEY, all);
}

/* ─── Packages ─────────────────────────────── */
export function getPackages() {
  return load(PKG_KEY, initialPackages);
}

export function getPackageBySlug(slug: string) {
  return getPackages().find((p: { slug: string }) => p.slug === slug);
}

export function getPackagesByDestination(destinationSlug: string) {
  return getPackages().filter((p: { destinationSlug: string }) => p.destinationSlug === destinationSlug);
}

export function getFeaturedPackages() {
  return getPackages().filter((p: { featured: boolean }) => p.featured);
}

export function createPackage(pkg: Record<string, unknown>) {
  const all = getPackages() as Record<string, unknown>[];
  all.push(pkg);
  save(PKG_KEY, all);
}

export function updatePackage(slug: string, data: Record<string, unknown>) {
  const all = getPackages() as Record<string, unknown>[];
  const idx = all.findIndex((p) => (p as { slug: string }).slug === slug);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(PKG_KEY, all);
  }
}

export function deletePackage(slug: string) {
  const all = (getPackages() as Record<string, unknown>[]).filter((p) => (p as { slug: string }).slug !== slug);
  save(PKG_KEY, all);
}

/* ─── Departures ─────────────────────────── */
export function getDepartures() {
  return load(DEP_KEY, initialDepartures);
}

export function getDeparturesByPackage(packageSlug: string) {
  return getDepartures().filter((d: { packageSlug: string }) => d.packageSlug === packageSlug);
}

export function getUpcomingDepartures(limit = 50) {
  const today = new Date().toISOString().split("T")[0];
  return getDepartures()
    .filter((d: { startDate: string; status: string }) => d.startDate >= today && d.status !== "closed")
    .sort((a: { startDate: string }, b: { startDate: string }) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export function createDeparture(dep: Record<string, unknown>) {
  const all = getDepartures() as Record<string, unknown>[];
  all.push(dep);
  save(DEP_KEY, all);
}

export function updateDeparture(id: string, data: Record<string, unknown>) {
  const all = getDepartures() as Record<string, unknown>[];
  const idx = all.findIndex((d) => (d as { id: string }).id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...data };
    save(DEP_KEY, all);
  }
}

export function deleteDeparture(id: string) {
  const all = (getDepartures() as Record<string, unknown>[]).filter((d) => (d as { id: string }).id !== id);
  save(DEP_KEY, all);
}

/* ─── Reset ──────────────────────────────── */
export function resetAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEST_KEY);
  localStorage.removeItem(PKG_KEY);
  localStorage.removeItem(DEP_KEY);
}
