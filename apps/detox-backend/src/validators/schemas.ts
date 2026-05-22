import { z } from "zod";

// ─── Shared ──────────────────────────────────────
export const slugSchema = z.string().min(1).max(255);
export const uuidSchema = z.string().uuid();

// ─── Destinations ────────────────────────────────
export const destinationSlugParam = z.object({
  slug: slugSchema,
});

// ─── Packages ────────────────────────────────────
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
