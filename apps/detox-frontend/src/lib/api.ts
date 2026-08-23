import type {
  Destination,
  Package,
  Departure,
  GuideArticle,
  FaqItem,
  Testimonial,
} from "@urbandetox/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.urbandetox.in";

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function authApi<T>(path: string, options?: RequestInit): Promise<T> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("You must be signed in to continue");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error || `API error: ${res.status}`);
  }
  return body as T;
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

// ── Seasonal Tags ───────────────────────────────────
export async function fetchSeasonalTags(): Promise<
  import("@urbandetox/utils").SeasonalTag[]
> {
  return api<import("@urbandetox/utils").SeasonalTag[]>("/api/seasonal-tags");
}

// ── Testimonials ────────────────────────────────────
export async function fetchTestimonials(limit = 4): Promise<Testimonial[]> {
  return api<Testimonial[]>(`/api/testimonials?limit=${limit}`);
}

// ── Google Reviews ──────────────────────────────────
export interface GoogleReview {
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  rating: number;
  total: number;
  url: string;
}

export async function fetchGoogleReviews(): Promise<GoogleReviewsResponse> {
  return api<GoogleReviewsResponse>("/api/google-reviews");
}

// ── Bookings ──────────────────────────────────────
export async function fetchMyBookings(): Promise<unknown[]> {
  return authApi("/api/bookings/me");
}

export type BookingNextStep =
  | { action: "book" }
  | {
      action: "continue_payment";
      checkoutSessionId: string;
      checkoutIdempotencyKey: string;
      travelerCount: number;
      customer: { name: string; phone: string; email?: string };
      expiresAt: string;
      checkoutStatus: string;
      message: string;
    }
  | {
      action: "complete_onboarding";
      bookingId: string;
      bookingStatus: string;
      paymentStatus: "paid" | "cod" | "pending";
      travelerCount: number;
      customer: { name: string; phone: string; email?: string };
      onboardingStep: number;
      message: string;
    }
  | {
      action: "view_booking";
      bookingId: string;
      bookingStatus: string;
      message: string;
    };

export async function fetchBookingNextStep(
  departureCode: string
): Promise<BookingNextStep> {
  return authApi(
    `/api/bookings/me/status?departureCode=${encodeURIComponent(departureCode)}`
  );
}

export async function cancelMyBooking(
  bookingId: string
): Promise<{ status: string }> {
  return authApi(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: "POST",
  });
}

export async function createCheckoutSession(payload: {
  idempotencyKey: string;
  departureCode: string;
  travelerCount: number;
  customer: { name: string; phone: string; email?: string };
}): Promise<{
  checkoutSessionId: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  razorpayMode: "test" | "live";
  expiresAt: string;
  status: string;
}> {
  return authApi("/api/payments/checkout-sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyRazorpayPayment(payload: {
  checkoutSessionId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ status: string; bookingId?: string; checkoutSessionId: string }> {
  return authApi("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCheckoutStatus(
  checkoutSessionId: string
): Promise<{
  checkoutSessionId: string;
  status: string;
  expiresAt: string;
  bookingId?: string;
}> {
  return authApi(
    `/api/payments/checkout-sessions/${encodeURIComponent(checkoutSessionId)}/status`
  );
}

export async function createPayOnArrival(payload: {
  idempotencyKey: string;
  departureCode: string;
  travelerCount: number;
  customer: { name: string; phone: string; email?: string };
}): Promise<{ bookingId: string; status: string }> {
  return authApi("/api/payments/pay-on-arrival", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBookingOnboarding(
  bookingId: string,
  payload: {
    travelers: import("@urbandetox/utils").Traveler[];
    common: import("@urbandetox/utils").CommonDetails;
  }
): Promise<unknown> {
  return authApi(`/api/bookings/${encodeURIComponent(bookingId)}/onboarding`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function saveOnboardingProgress(
  bookingId: string,
  payload: {
    step: number;
    travelers: import("@urbandetox/utils").Traveler[];
    common: import("@urbandetox/utils").CommonDetails;
  }
): Promise<unknown> {
  return authApi(`/api/bookings/${encodeURIComponent(bookingId)}/onboarding/progress`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchOnboardingProgress(bookingId: string): Promise<{
  travelers: import("@urbandetox/utils").Traveler[];
  common: import("@urbandetox/utils").CommonDetails;
  onboardingStep: number;
  onboardingComplete: boolean;
}> {
  return authApi(`/api/bookings/${encodeURIComponent(bookingId)}/onboarding/progress`);
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Settings error: ${res.status}`);
    }
    return res.json() as Promise<import("@urbandetox/utils").SiteSettings>;
  } finally {
    clearTimeout(timeout);
  }
}
