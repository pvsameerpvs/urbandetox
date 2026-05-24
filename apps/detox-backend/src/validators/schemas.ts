import { z } from "zod";

// ─── Shared ──────────────────────────────────────
export const slugSchema = z.string().min(1).max(255);
export const uuidSchema = z.string().uuid();

// ─── Destinations ────────────────────────────────
export const destinationSlugParam = z.object({
  slug: slugSchema,
});

export const createDestinationBody = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(255),
  region: z.string().min(1).max(255),
  description: z.string().min(1),
  image: z.string().min(1),
  gallery: z.array(z.string()).optional(),
  meetingPoint: z.string().min(1).max(255),
  vibe: z.string().min(1).max(255),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateDestinationBody = createDestinationBody.partial().omit({ slug: true });

// ─── Packages ────────────────────────────────────
export const createPackageBody = z.object({
  slug: slugSchema,
  destinationSlug: slugSchema,
  title: z.string().min(1).max(255),
  subtitle: z.string().min(1).max(255),
  duration: z.number().int().min(1),
  durationLabel: z.string().min(1).max(100),
  highlights: z.array(z.string()),
  itinerary: z.array(z.any()),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  coverImage: z.string().min(1),
  startingPrice: z.number().min(0),
  groupSize: z.string().min(1).max(50),
  style: z.string().min(1).max(100),
  guideLed: z.boolean().optional(),
  featured: z.boolean().optional(),
  seasonalTag: z.string().optional(),
  itineraryPdf: z.string().optional(),
});

export const updatePackageBody = createPackageBody.partial().omit({ slug: true });
export const packageSlugParam = z.object({
  slug: slugSchema,
});

export const packageListQuery = z.object({
  destination: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
});

// ─── Departures ──────────────────────────────────
export const departureCodeParam = z.object({
  code: z.string().min(1).max(50),
});

export const departureListQuery = z.object({
  package: z.string().optional(),
  upcoming: z.enum(["true", "false"]).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

// ─── Guides ──────────────────────────────────────
export const guideSlugParam = z.object({
  slug: slugSchema,
});

export const guideListQuery = z.object({
  featured: z.enum(["true", "false"]).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  category: z.string().optional(),
});

export const guideRelatedQuery = z.object({
  limit: z.string().regex(/^\d+$/).optional(),
});

// ─── FAQs ────────────────────────────────────────
export const faqListQuery = z.object({
  category: z.string().optional(),
});

// ─── Testimonials ──────────────────────────────────
export const testimonialListQuery = z.object({
  limit: z.string().regex(/^\d+$/).optional(),
});

// ─── Bookings ──────────────────────────────────────
export const createBookingBody = z.object({
  departureCode: z.string().min(1).max(50),
  fullName: z.string().min(2).max(255),
  phone: z.string().min(5).max(50),
  email: z.string().optional(),
  travelers: z.number().int().min(1).max(50).optional(),
  details: z.any().optional(),
});

// ─── Contact ──────────────────────────────────────
export const contactFormBody = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(5).max(5000),
});
