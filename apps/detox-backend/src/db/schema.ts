import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

export const departureStatusEnum = pgEnum("departure_status", [
  "open",
  "filling",
  "full",
  "closed",
]);

export const destinations = pgTable("destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  meetingPoint: varchar("meeting_point", { length: 255 }).notNull(),
  vibe: varchar("vibe", { length: 255 }).notNull(),
  itineraryPdf: text("itinerary_pdf"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  destinationSlug: varchar("destination_slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }).notNull(),
  duration: integer("duration").notNull(),
  durationLabel: varchar("duration_label", { length: 100 }).notNull(),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  itinerary: jsonb("itinerary").$type<
    Array<{
      day: number;
      title: string;
      description: string;
      activities: string[];
      stay?: string;
      meals?: string;
      travelNotes?: string;
      image?: string;
    }>
  >(),
  included: jsonb("included").$type<string[]>().default([]),
  notIncluded: jsonb("not_included").$type<string[]>().default([]),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  faqs: jsonb("faqs").$type<Array<{ question: string; answer: string }>>().default([]),
  coverImage: text("cover_image").notNull(),
  startingPrice: numeric("starting_price", { precision: 10, scale: 2 }).notNull(),
  groupSize: varchar("group_size", { length: 50 }).notNull(),
  style: varchar("style", { length: 100 }).notNull(),
  guideLed: boolean("guide_led").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  seasonalTag: varchar("seasonal_tag", { length: 100 }),
});

export const departures = pgTable("departures", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  packageSlug: varchar("package_slug", { length: 255 }).notNull(),
  destinationSlug: varchar("destination_slug", { length: 255 }).notNull(),
  startDate: varchar("start_date", { length: 20 }).notNull(),
  endDate: varchar("end_date", { length: 20 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  offerPrice: numeric("offer_price", { precision: 10, scale: 2 }),
  seatsTotal: integer("seats_total").notNull(),
  seatsLeft: integer("seats_left").notNull(),
  status: departureStatusEnum("status").notNull().default("open"),
});

export const guides = pgTable("guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  destinationSlug: varchar("destination_slug", { length: 255 }),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  relatedPackageSlugs: jsonb("related_package_slugs").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  quote: text("quote").notNull(),
  image: text("image"),
  destinationSlug: varchar("destination_slug", { length: 255 }),
  tripDate: varchar("trip_date", { length: 20 }),
  rating: integer("rating").notNull(),
});

export const seasonalTags = pgTable("seasonal_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  iconName: varchar("icon_name", { length: 50 }).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const userRoleEnum = pgEnum("user_role", ["admin", "authenticated"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  gender: varchar("gender", { length: 50 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("authenticated"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  departureCode: varchar("departure_code", { length: 50 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  travelers: integer("travelers").notNull().default(1),
  status: varchar("status", { length: 50 }).notNull().default("confirmed"),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  details: jsonb("details").$type<{
    travelers?: Array<{
      id: string;
      type: "primary" | "companion";
      name: string;
      phone: string;
      email: string;
      dateOfBirth: string;
      gender: string;
      foodPreference: string;
      allergies: string;
      medicalConditions: string;
      bloodGroup: string;
      photoUrl: string;
      idUrl?: string;
      idType?: string;
      emergencyName: string;
      emergencyPhone: string;
      emergencyRelation: string;
    }>;
    common?: {
      groupNote: string;
      modeOfArrival: string;
      needsTravelHelp: boolean;
    };
    onboardingComplete?: boolean;
    paymentMethod?: "razorpay" | "cod";
    bookedByName?: string;
    bookedByEmail?: string;
    bookedByPhone?: string;
  }>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  config: jsonb("config").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Departure = typeof departures.$inferSelect;
export type GuideArticle = typeof guides.$inferSelect;
export type FaqItem = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type SeasonalTag = typeof seasonalTags.$inferSelect;
export type BookingRecord = typeof bookings.$inferSelect;
export type SiteSettingsRecord = typeof siteSettings.$inferSelect;
