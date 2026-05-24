import type {
  Destination,
  Package,
  Departure,
  GuideArticle,
  FaqItem,
  Testimonial,
} from "@urbandetox/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ── Destinations ────────────────────────────────────
export async function fetchDestinations(): Promise<Destination[]> {
  return api<Destination[]>("/api/destinations");
}

export async function fetchDestinationBySlug(
  slug: string
): Promise<Destination | undefined> {
  try {
    return await api<Destination>(`/api/destinations/${slug}`);
  } catch {
    return undefined;
  }
}

// ── Packages ──────────────────────────────────────
export async function fetchPackages(): Promise<Package[]> {
  return api<Package[]>("/api/packages");
}

export async function fetchPackagesByDestination(
  destinationSlug: string
): Promise<Package[]> {
  return api<Package[]>(`/api/packages?destination=${destinationSlug}`);
}

export async function fetchPackageBySlug(
  slug: string
): Promise<Package | undefined> {
  try {
    return await api<Package>(`/api/packages/${slug}`);
  } catch {
    return undefined;
  }
}

export async function fetchFeaturedPackages(): Promise<Package[]> {
  return api<Package[]>("/api/packages?featured=true");
}

// ── Departures ────────────────────────────────────
export async function fetchDeparturesByPackage(
  packageSlug: string
): Promise<Departure[]> {
  return api<Departure[]>(`/api/departures?package=${packageSlug}`);
}

export async function fetchDepartureByCode(
  code: string
): Promise<Departure | undefined> {
  try {
    return await api<Departure>(`/api/departures/${code}`);
  } catch {
    return undefined;
  }
}

export async function fetchUpcomingDepartures(limit = 6): Promise<Departure[]> {
  const res = await fetch(`${API_BASE}/api/departures?upcoming=true&limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Departure[]>;
}

// ── Guides ──────────────────────────────────────────
export async function fetchGuides(): Promise<GuideArticle[]> {
  return api<GuideArticle[]>("/api/guides");
}

export async function fetchGuideBySlug(
  slug: string
): Promise<GuideArticle | undefined> {
  try {
    return await api<GuideArticle>(`/api/guides/${slug}`);
  } catch {
    return undefined;
  }
}

export async function fetchFeaturedGuides(limit = 4): Promise<GuideArticle[]> {
  return api<GuideArticle[]>(`/api/guides?featured=true&limit=${limit}`);
}

export async function fetchRelatedGuides(
  currentSlug: string,
  limit = 3
): Promise<GuideArticle[]> {
  return api<GuideArticle[]>(`/api/guides/${currentSlug}/related?limit=${limit}`);
}

export async function fetchGuideCategories(): Promise<string[]> {
  return api<string[]>("/api/guides/categories");
}

// ── FAQs ────────────────────────────────────────────
export async function fetchAllFaqs(): Promise<FaqItem[]> {
  return api<FaqItem[]>("/api/faqs");
}

export async function fetchFaqCategories(): Promise<string[]> {
  return api<string[]>("/api/faqs/categories");
}

// ── Testimonials ────────────────────────────────────
export async function fetchTestimonials(limit = 4): Promise<Testimonial[]> {
  return api<Testimonial[]>(`/api/testimonials?limit=${limit}`);
}

// ── Bookings ──────────────────────────────────────
export async function fetchMyBookings(): Promise<unknown[]> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_BASE}/api/bookings/me`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function createBooking(payload: {
  departureCode: string;
  fullName: string;
  phone: string;
  email?: string;
  travelers?: number;
}): Promise<unknown> {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Booking failed: ${res.status}`);
  return res.json();
}

// ── Contact ────────────────────────────────────────
export async function submitContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Contact failed: ${res.status}`);
  return res.json();
}

// ── Site Settings ────────────────────────────────────
export async function fetchSiteSettings(): Promise<import("@urbandetox/utils").SiteSettings> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Settings error: ${res.status}`);
  }
  return res.json() as Promise<import("@urbandetox/utils").SiteSettings>;
}
