/**
 * The controlled vocabulary behind Explore Detox filtering, the homepage search
 * and the audience pages. Values here are what get stored in the database, so
 * changing a `value` is a data migration. Labels are what customers read.
 */

export type Audience = "solo" | "family" | "couples" | "corporate" | "college" | "b2b";
export type Theme = "adventure" | "wellness" | "relaxation" | "culture" | "party";
export type Terrain = "beach" | "mountains" | "forest" | "backwater";
export type DestinationType = "hills" | "beach" | "forest" | "backwater" | "coastal" | "desert";
export type FitnessLevel = "easy" | "moderate" | "active";
export type PackageStatus = "draft" | "live" | "sold_out" | "coming_soon";
export type ContentStatus = "active" | "hidden" | "coming_soon";

export interface TaxonomyOption<T extends string> {
  value: T;
  label: string;
}

export const AUDIENCES: TaxonomyOption<Audience>[] = [
  { value: "solo", label: "Solo Travellers" },
  { value: "family", label: "Family Trips" },
  { value: "couples", label: "Couples" },
  { value: "corporate", label: "Corporate Trips" },
  { value: "college", label: "College Groups" },
  { value: "b2b", label: "B2B Partners" },
];

export const THEMES: TaxonomyOption<Theme>[] = [
  { value: "adventure", label: "Adventure" },
  { value: "wellness", label: "Relaxation & Wellness" },
  { value: "relaxation", label: "Slow & Restful" },
  { value: "culture", label: "Culture & Local Life" },
  { value: "party", label: "Social & Lively" },
];

export const TERRAINS: TaxonomyOption<Terrain>[] = [
  { value: "beach", label: "Beach" },
  { value: "mountains", label: "Mountains" },
  { value: "forest", label: "Forest" },
  { value: "backwater", label: "Backwaters" },
];

export const DESTINATION_TYPES: TaxonomyOption<DestinationType>[] = [
  { value: "hills", label: "Hills" },
  { value: "beach", label: "Beach" },
  { value: "forest", label: "Forest" },
  { value: "backwater", label: "Backwaters" },
  { value: "coastal", label: "Coastal" },
  { value: "desert", label: "Desert" },
];

export const FITNESS_LEVELS: TaxonomyOption<FitnessLevel>[] = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
];

export const PACKAGE_STATUSES: TaxonomyOption<PackageStatus>[] = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
  { value: "sold_out", label: "Sold Out" },
  { value: "coming_soon", label: "Coming Soon" },
];

export const CONTENT_STATUSES: TaxonomyOption<ContentStatus>[] = [
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
  { value: "coming_soon", label: "Coming Soon" },
];

/**
 * Budget bands used by the price filter, in rupees. `max: null` means no ceiling.
 *
 * Boundaries must not overlap: the API filters with `>= min` and `<= max`, so a
 * shared boundary would put a trip priced exactly on it into two bands at once.
 * Each `max` therefore stops one rupee below the next band's `min`.
 */
export const BUDGET_BANDS = [
  { value: "under-10000", label: "Under ₹10,000", min: 0, max: 9999 },
  { value: "10000-15000", label: "₹10,000 – ₹15,000", min: 10000, max: 14999 },
  { value: "15000-25000", label: "₹15,000 – ₹25,000", min: 15000, max: 24999 },
  { value: "above-25000", label: "Above ₹25,000", min: 25000, max: null },
] as const;

export type BudgetBand = (typeof BUDGET_BANDS)[number]["value"];

const label = <T extends string>(opts: TaxonomyOption<T>[], value: string) =>
  opts.find((o) => o.value === value)?.label ?? value;

export const audienceLabel = (v: string) => label(AUDIENCES, v);
export const themeLabel = (v: string) => label(THEMES, v);
export const terrainLabel = (v: string) => label(TERRAINS, v);
export const destinationTypeLabel = (v: string) => label(DESTINATION_TYPES, v);
export const fitnessLevelLabel = (v: string) => label(FITNESS_LEVELS, v);
