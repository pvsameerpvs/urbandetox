import { z } from "zod";

const AUDIENCE_VALUES = ["solo", "family", "couples", "corporate", "college", "b2b"] as const;
const THEME_VALUES = ["adventure", "wellness", "relaxation", "culture", "party"] as const;
const TERRAIN_VALUES = ["beach", "mountains", "forest", "backwater"] as const;
const DESTINATION_TYPE_VALUES = ["hills", "beach", "forest", "backwater", "coastal", "desert"] as const;

// ─── Shared ──────────────────────────────────────
const slugSchema = z.string().min(1).max(255);
const uuidSchema = z.string().uuid();

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
  codePrefix: z.string().min(2).max(10).optional(),
  state: z.string().max(100).nullish(),
  country: z.string().max(100).nullish(),
  bestTimeToVisit: z.string().max(255).nullish(),
  travelTimeFromBangalore: z.string().max(100).nullish(),
  destinationTypes: z.array(z.enum(DESTINATION_TYPE_VALUES)).nullish(),
  imageAlt: z.string().nullish(),
  status: z.enum(["active", "hidden", "coming_soon"]).optional(),
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

  audiences: z.array(z.enum(AUDIENCE_VALUES)).nullish(),
  themes: z.array(z.enum(THEME_VALUES)).nullish(),
  terrains: z.array(z.enum(TERRAIN_VALUES)).nullish(),
  isDomestic: z.boolean().optional(),
  isWeekend: z.boolean().optional(),
  fitnessLevel: z.enum(["easy", "moderate", "active"]).nullish(),

  pickupPoint: z.string().max(255).nullish(),
  dropPoint: z.string().max(255).nullish(),
  pickupTime: z.string().max(10).nullish(),
  returnTime: z.string().max(10).nullish(),
  pickupMapImage: z.string().nullish(),
  pickupMapUrl: z.string().nullish(),
  transportType: z.string().max(100).nullish(),
  stayType: z.string().max(100).nullish(),
  roomSharing: z.string().max(100).nullish(),
  mealPlan: z.string().max(255).nullish(),

  womenFriendly: z.boolean().optional(),
  soloFriendly: z.boolean().optional(),
  whatToPack: z.array(z.string()).nullish(),
  thingsToKnow: z.array(z.string()).nullish(),
  cancellationPolicy: z.string().nullish(),

  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
  status: z.enum(["draft", "live", "sold_out", "coming_soon"]).optional(),
});

export const updatePackageBody = createPackageBody.partial().omit({ slug: true });
export const packageSlugParam = z.object({
  slug: slugSchema,
});

export const packageListQuery = z.object({
  destination: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  // Comma-separated taxonomy values, validated per-item in the controller.
  audience: z.string().max(200).optional(),
  theme: z.string().max(200).optional(),
  terrain: z.string().max(200).optional(),
  fitness: z.string().max(100).optional(),
  duration: z.string().max(50).optional(),
  domestic: z.enum(["true", "false"]).optional(),
  weekend: z.enum(["true", "false"]).optional(),
  // Comma-separated BUDGET_BANDS values; unknown values are ignored by the
  // controller rather than rejected, so a stale bookmark still returns results.
  budget: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  seasonalTag: z.string().max(100).optional(),
  status: z.enum(["draft", "live", "sold_out", "coming_soon", "all"]).optional(),
  q: z.string().max(200).optional(),
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

const checkoutCustomer = z.object({
  name: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(5).max(50),
  email: z.string().email().optional(),
}).strict();

export const createCheckoutBody = z.object({
  idempotencyKey: z.string().min(10).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  departureCode: z.string().min(1).max(50),
  travelerCount: z.number().int().min(1).max(20),
  customer: checkoutCustomer,
}).strict();

export const payOnArrivalBody = z.object({
  idempotencyKey: z.string().min(10).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  departureCode: z.string().min(1).max(50),
  travelerCount: z.number().int().min(1).max(20),
  customer: checkoutCustomer,
}).strict();

export const verifyPaymentBody = z.object({
  checkoutSessionId: uuidSchema,
  razorpayPaymentId: z.string().min(5).max(100),
  razorpaySignature: z.string().length(64).regex(/^[a-f0-9]+$/i),
}).strict();

export const refundPaymentBody = z.object({
  amountPaise: z.number().int().positive().optional(),
  idempotencyKey: z.string().min(10).max(100).regex(/^[a-zA-Z0-9_-]+$/),
}).strict();

const onboardingTraveler = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(["primary", "companion"]),
  name: z.string().max(255),
  phone: z.string().max(50),
  email: z.string().max(255),
  dateOfBirth: z.string().max(20),
  gender: z.string().max(50),
  foodPreference: z.string().max(100),
  allergies: z.string().max(1000),
  medicalConditions: z.string().max(2000),
  bloodGroup: z.string().max(20),
  photoUrl: z.string().max(2000),
  idUrl: z.string().max(2000).optional(),
  idType: z.string().max(100).optional(),
  emergencyName: z.string().max(255),
  emergencyPhone: z.string().max(50),
  emergencyRelation: z.string().max(100),
}).strict();

export const updateOnboardingBody = z.object({
  travelers: z.array(onboardingTraveler).min(1).max(20),
  common: z.object({
    groupNote: z.string().max(2000),
    modeOfArrival: z.string().max(255),
    needsTravelHelp: z.boolean(),
  }).strict(),
}).strict();

export const saveOnboardingProgressBody = z.object({
  step: z.number().int().min(1).max(4),
  travelers: z.array(onboardingTraveler).min(1).max(20),
  common: z.object({
    groupNote: z.string().max(2000),
    modeOfArrival: z.string().max(255),
    needsTravelHelp: z.boolean(),
  }).strict(),
}).strict();

// ─── Contact ──────────────────────────────────────
export const contactFormBody = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(5).max(5000),
});

// ─── Guide applications ──────────────────────────
export const guideApplicationBody = z.object({
  fullName: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(50),
  city: z.string().trim().max(255).optional(),
  destinations: z.array(z.string().max(255)).max(20).optional(),
  languages: z.array(z.string().max(60)).max(15).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  experience: z.string().max(3000).optional(),
  about: z.string().max(3000).optional(),
  instagram: z.string().max(255).optional(),
  resumeUrl: z.string().max(2000).optional(),
  photoUrl: z.string().max(2000).optional(),
}).strict();

export const guideApplicationUpdateBody = z.object({
  status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired"]).optional(),
  adminNotes: z.string().max(3000).optional(),
}).strict();

export const guideApplicationListQuery = z.object({
  status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired", "all"]).optional(),
});

// ─── Booking share links ─────────────────────────
export const shareLinkBody = z.object({
  ttlDays: z.number().int().min(1).max(60).optional(),
}).strict();

export const shareTokenParam = z.object({
  token: z.string().min(20).max(200).regex(/^[A-Za-z0-9_-]+$/),
});

/** Public "hire a local guide" submission. */
export const guideRequestBody = z.object({
  fullName: z.string().min(2, "Name is required").max(255),
  email: z.string().email("Enter a valid email").max(255),
  phone: z.string().min(7, "Enter a valid phone number").max(50),
  // Free text, because the point is a guide for ANY location, including ones
  // we do not run trips to.
  location: z.string().min(2, "Tell us where").max(255),
  travelDates: z.string().max(255).optional(),
  groupSize: z.number().int().min(1).max(200).optional(),
  needs: z.string().max(2000).optional(),
  languages: z.array(z.string().max(60)).max(10).optional(),
});

export const guideRequestListQuery = z.object({
  status: z.string().max(20).optional(),
});

export const guideRequestUpdateBody = z.object({
  status: z.enum(["new", "contacted", "matched", "closed"]).optional(),
  adminNotes: z.string().max(4000).optional(),
});
