"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Destinations ────────────────────────────────────
export async function fetchDestinations<T = unknown>(): Promise<T[]> {
  return api("/api/destinations");
}

export async function fetchDestinationBySlug<T = unknown>(slug: string): Promise<T | undefined> {
  try {
    return await api<T>(`/api/destinations/${slug}`);
  } catch {
    return undefined;
  }
}

export async function createDestination<T = unknown>(data: T): Promise<T> {
  return api("/api/destinations", { method: "POST", body: JSON.stringify(data) });
}

export async function updateDestination<T = unknown>(slug: string, data: Partial<T>): Promise<T> {
  return api(`/api/destinations/${slug}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteDestination(slug: string): Promise<void> {
  await api(`/api/destinations/${slug}`, { method: "DELETE" });
}

// ─── Packages ──────────────────────────────────────
export async function fetchPackages<T = unknown>(): Promise<T[]> {
  return api("/api/packages");
}

export async function fetchPackageBySlug<T = unknown>(slug: string): Promise<T | undefined> {
  try {
    return await api<T>(`/api/packages/${slug}`);
  } catch {
    return undefined;
  }
}

export async function createPackage<T = unknown>(data: T): Promise<T> {
  return api("/api/packages", { method: "POST", body: JSON.stringify(data) });
}

export async function updatePackage<T = unknown>(slug: string, data: Partial<T>): Promise<T> {
  return api(`/api/packages/${slug}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deletePackage(slug: string): Promise<void> {
  await api(`/api/packages/${slug}`, { method: "DELETE" });
}

// ─── Departures ────────────────────────────────────
export async function fetchDepartures<T = unknown>(): Promise<T[]> {
  return api("/api/departures");
}

export async function fetchDepartureByCode<T = unknown>(code: string): Promise<T | undefined> {
  try {
    return await api<T>(`/api/departures/${code}`);
  } catch {
    return undefined;
  }
}

export async function createDeparture<T = unknown>(data: T): Promise<T> {
  return api("/api/departures", { method: "POST", body: JSON.stringify(data) });
}

export async function updateDeparture<T = unknown>(id: string, data: Partial<T>): Promise<T> {
  return api(`/api/departures/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteDeparture(id: string): Promise<void> {
  await api(`/api/departures/${id}`, { method: "DELETE" });
}

// ─── Guides ──────────────────────────────────────────
export async function fetchGuides<T = unknown>(): Promise<T[]> {
  return api("/api/guides");
}

export async function fetchGuideBySlug<T = unknown>(slug: string): Promise<T | undefined> {
  try {
    return await api<T>(`/api/guides/${slug}`);
  } catch {
    return undefined;
  }
}

export async function createGuide<T = unknown>(data: T): Promise<T> {
  return api("/api/guides", { method: "POST", body: JSON.stringify(data) });
}

export async function updateGuide<T = unknown>(id: string, data: Partial<T>): Promise<T> {
  return api(`/api/guides/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteGuide(id: string): Promise<void> {
  await api(`/api/guides/${id}`, { method: "DELETE" });
}

// ─── Seasonal Tags ─────────────────────────────────
export async function fetchSeasonalTags<T = unknown>(): Promise<T[]> {
  return api("/api/seasonal-tags");
}

export async function createSeasonalTag<T = unknown>(data: T): Promise<T> {
  return api("/api/seasonal-tags", { method: "POST", body: JSON.stringify(data) });
}

export async function updateSeasonalTag<T = unknown>(id: string, data: Partial<T>): Promise<T> {
  return api(`/api/seasonal-tags/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteSeasonalTag(id: string): Promise<void> {
  await api(`/api/seasonal-tags/${id}`, { method: "DELETE" });
}

// ─── Bookings ──────────────────────────────────────
export async function fetchBookings<T = unknown>(): Promise<T[]> {
  return api("/api/bookings");
}

export async function createBooking<T = unknown>(data: T): Promise<T> {
  return api("/api/bookings", { method: "POST", body: JSON.stringify(data) });
}
