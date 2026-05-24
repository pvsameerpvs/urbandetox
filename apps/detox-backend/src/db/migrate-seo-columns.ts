import { db } from "./index";
import { sql } from "drizzle-orm";

async function runMigrations() {
  console.log("Checking destination columns...");

  const checkColumn = async (table: string, column: string) => {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${table}
        AND column_name = ${column}
      );
    `);
    return result.rows[0]?.exists === true;
  };

  // ─── Destinations ───────────────────────────────
  const destColumns = [
    { name: "seo_title", type: "text" },
    { name: "seo_description", type: "text" },
  ];

  for (const col of destColumns) {
    const exists = await checkColumn("destinations", col.name);
    if (exists) {
      console.log(`  Column "${col.name}" already exists — skipping.`);
    } else {
      console.log(`  Adding column "${col.name}" (${col.type})...`);
      await db.execute(sql`
        ALTER TABLE destinations ADD COLUMN ${sql.raw(col.name)} ${sql.raw(col.type)};
      `);
      console.log(`  Column "${col.name}" added.`);
    }
  }

  // Drop old itinerary_pdf from destinations if it still exists
  const hasOldItineraryPdf = await checkColumn("destinations", "itinerary_pdf");
  if (hasOldItineraryPdf) {
    console.log('  Dropping old "itinerary_pdf" from destinations...');
    await db.execute(sql`ALTER TABLE destinations DROP COLUMN itinerary_pdf;`);
    console.log('  Dropped.');
  }

  // ─── Packages ───────────────────────────────────
  console.log("Checking package columns...");
  const hasPackageItineraryPdf = await checkColumn("packages", "itinerary_pdf");
  if (hasPackageItineraryPdf) {
    console.log('  Column "itinerary_pdf" already exists on packages — skipping.');
  } else {
    console.log('  Adding column "itinerary_pdf" (text) to packages...');
    await db.execute(sql`ALTER TABLE packages ADD COLUMN itinerary_pdf text;`);
    console.log('  Column added.');
  }

  console.log("All columns ready.");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
