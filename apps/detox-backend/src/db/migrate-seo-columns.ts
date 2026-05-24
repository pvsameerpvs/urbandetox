import { db } from "./index";
import { sql } from "drizzle-orm";

async function addDestinationSeoColumns() {
  console.log("Checking destination columns...");

  const checkColumn = async (column: string) => {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'destinations'
        AND column_name = ${column}
      );
    `);
    return result.rows[0]?.exists === true;
  };

  const columns = [
    { name: "itinerary_pdf", type: "text" },
    { name: "seo_title", type: "text" },
    { name: "seo_description", type: "text" },
  ];

  for (const col of columns) {
    const exists = await checkColumn(col.name);
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

  console.log("All destination columns ready.");
  process.exit(0);
}

addDestinationSeoColumns().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
