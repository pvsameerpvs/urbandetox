import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

import {
  destinations as staticDestinations,
  packages as staticPackages,
  departures as staticDepartures,
  getAllGuides,
  getAllFaqs,
  getTestimonials,
  initialSeasonalTags,
} from "@urbandetox/utils";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seed() {
  console.log("Seeding database via Supabase REST API...");

  const tables: Array<{
    name: string;
    data: unknown[];
    conflict?: string;
  }> = [
    { name: "destinations", data: staticDestinations, conflict: "slug" },
    { name: "packages", data: staticPackages, conflict: "slug" },
    { name: "departures", data: staticDepartures, conflict: "code" },
    { name: "guides", data: getAllGuides(), conflict: "slug" },
    { name: "faqs", data: getAllFaqs() },
    { name: "testimonials", data: getTestimonials(100) },
    { name: "seasonal_tags", data: initialSeasonalTags, conflict: "slug" },
  ];

  for (const { name, data, conflict } of tables) {
    if (!data || data.length === 0) {
      console.log(`  ${name}: skipped (no data)`);
      continue;
    }

    if (conflict) {
      const { error } = await supabase
        .from(name)
        .upsert(data as any, { onConflict: conflict });
      if (error) {
        console.error(`  ${name} failed:`, error.message);
      } else {
        console.log(`  ${name}: ${data.length} rows`);
      }
    } else {
      // Tables without a natural unique column — plain insert
      const { error } = await supabase.from(name).insert(data as any);
      if (error) {
        console.error(`  ${name} failed:`, error.message);
      } else {
        console.log(`  ${name}: ${data.length} rows`);
      }
    }
  }

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
