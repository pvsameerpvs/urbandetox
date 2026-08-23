"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
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
  // status=all so the admin sees drafts and sold-out trips, not just live ones.
  return api("/api/packages?status=all");
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

// ─── FAQs ──────────────────────────────────────────
export async function fetchFaqs<T = unknown>(): Promise<T[]> {
  return api("/api/faqs");
}

export async function createFaq<T = unknown>(data: T): Promise<T> {
  return api("/api/faqs", { method: "POST", body: JSON.stringify(data) });
}

export async function updateFaq<T = unknown>(id: string, data: Partial<T>): Promise<T> {
  return api(`/api/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteFaq(id: string): Promise<void> {
  await api(`/api/faqs/${id}`, { method: "DELETE" });
}

// ─── Testimonials ──────────────────────────────────
export async function fetchTestimonials<T = unknown>(): Promise<T[]> {
  return api("/api/testimonials");
}

export async function createTestimonial<T = unknown>(data: T): Promise<T> {
  return api("/api/testimonials", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTestimonial<T = unknown>(id: string, data: Partial<T>): Promise<T> {
  return api(`/api/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await api(`/api/testimonials/${id}`, { method: "DELETE" });
}

// ─── Users (Admin-only) ────────────────────────────
export interface PaginatedUsersResponse {
  data: Array<{
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    avatarUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    bookingsCount: number;
  }>;
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function fetchUsers(params?: {
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedUsersResponse> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.role) qs.set("role", params.role);
  if (params?.sortBy) qs.set("sortBy", params.sortBy);
  if (params?.sortOrder) qs.set("sortOrder", params.sortOrder);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  const query = qs.toString();
  return api(`/api/users${query ? `?${query}` : ""}`);
}

export async function fetchUserById(id: string) {
  return api(`/api/users/${id}`);
}

export async function updateUserRole(id: string, role: string) {
  return api(`/api/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

// ─── File Upload ────────────────────────────────────
export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(file: File, folder?: string): Promise<UploadResult> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const formData = new FormData();
  formData.append("file", file);

  const query = folder ? `?folder=${encodeURIComponent(folder)}` : "";
  const res = await fetch(`${API_BASE}/api/uploads${query}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Upload error: ${res.status}`);
  }

  return res.json() as Promise<UploadResult>;
}

/** @deprecated Use uploadFile instead. Kept for backward compatibility. */
export const uploadImage = uploadFile;

// ─── Site Settings ───────────────────────────────────
export async function fetchSiteSettings() {
  return api<import("@urbandetox/utils").SiteSettings>("/api/settings");
}

export async function updateSiteSettings(
  data: Partial<import("@urbandetox/utils").SiteSettings>
) {
  return api<import("@urbandetox/utils").SiteSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Guide applications ──────────────────────────────
export interface GuideApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string | null;
  destinations: string[];
  languages: string[];
  experienceYears?: number | null;
  experience?: string | null;
  about?: string | null;
  instagram?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

export async function fetchGuideApplications(status?: string) {
  const qs = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return api<{ applications: GuideApplication[]; counts: Record<string, number> }>(
    `/api/guide-applications${qs}`
  );
}

export async function updateGuideApplication(
  id: string,
  patch: { status?: string; adminNotes?: string }
) {
  return api<GuideApplication>(`/api/guide-applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function deleteGuideApplication(id: string) {
  await api(`/api/guide-applications/${id}`, { method: "DELETE" });
}

// ─── Booking share links ─────────────────────────────
export async function issueBookingShareLink(bookingId: string, ttlDays?: number) {
  return api<{ url: string; expiresAt: string; message: string }>(
    `/api/bookings/${bookingId}/share-link`,
    { method: "POST", body: JSON.stringify(ttlDays ? { ttlDays } : {}) }
  );
}

export async function fetchBookingShareLinkStatus(bookingId: string) {
  return api<{ active: boolean; expiresAt?: string; lastUsedAt?: string | null; useCount?: number }>(
    `/api/bookings/${bookingId}/share-link`
  );
}

export async function revokeBookingShareLink(bookingId: string) {
  return api<{ revoked: number }>(`/api/bookings/${bookingId}/share-link`, { method: "DELETE" });
}

// ─── Traveller documents (private storage) ───────────
export async function fetchDocumentUrl(storagePath: string) {
  return api<{ url: string; expiresInSeconds: number }>(
    `/api/documents/signed-url?path=${encodeURIComponent(storagePath)}`
  );
}
