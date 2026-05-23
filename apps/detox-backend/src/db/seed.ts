/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./index";
import * as schema from "./schema";

import {
  destinations as staticDestinations,
  packages as staticPackages,
  departures as staticDepartures,
  getAllGuides,
  getAllFaqs,
  getTestimonials,
  initialSeasonalTags,
} from "@urbandetox/utils";

/** Strip client-side string IDs so Postgres generates proper UUIDs. */
function stripId<T extends { id?: unknown }>(items: T[]): Omit<T, "id">[] {
  return items.map(({ id: _unused, ...rest }) => rest as Omit<T, "id">);
}

async function seed() {
  console.log("Seeding database...");

  await db.insert(schema.destinations).values(stripId(staticDestinations) as any).onConflictDoNothing();
  console.log(`  ${staticDestinations.length} destinations`);

  await db.insert(schema.packages).values(stripId(staticPackages) as any).onConflictDoNothing();
  console.log(`  ${staticPackages.length} packages`);

  await db.insert(schema.departures).values(stripId(staticDepartures) as any).onConflictDoNothing();
  console.log(`  ${staticDepartures.length} departures`);

  const guides = getAllGuides();
  await db.insert(schema.guides).values(stripId(guides) as any).onConflictDoNothing();
  console.log(`  ${guides.length} guides`);

  const faqs = getAllFaqs();
  await db.insert(schema.faqs).values(stripId(faqs) as any).onConflictDoNothing();
  console.log(`  ${faqs.length} FAQs`);

  const testimonials = getTestimonials(100);
  await db.insert(schema.testimonials).values(stripId(testimonials) as any).onConflictDoNothing();
  console.log(`  ${testimonials.length} testimonials`);

  await db.insert(schema.seasonalTags).values(stripId(initialSeasonalTags) as any).onConflictDoNothing();
  console.log(`  ${initialSeasonalTags.length} seasonal tags`);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
