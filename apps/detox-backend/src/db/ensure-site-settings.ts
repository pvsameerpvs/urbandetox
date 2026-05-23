import { db } from "./index";
import { siteSettings } from "./schema";
import { defaultSiteSettings } from "@urbandetox/utils";
import { sql } from "drizzle-orm";

async function ensureSiteSettingsTable() {
  console.log("Ensuring site_settings table exists...");

  // Check if table exists using raw SQL
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'site_settings'
    );
  `);

  const exists = result.rows[0]?.exists === true;

  if (!exists) {
    console.log("Creating site_settings table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key varchar(50) NOT NULL UNIQUE,
        config jsonb NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("Table created.");
  } else {
    console.log("site_settings table already exists.");
  }

  // Check if global settings row exists
  const rows = await db.execute(sql`
    SELECT * FROM site_settings WHERE key = 'global';
  `);

  if (rows.rowCount === 0) {
    console.log("Inserting default site settings...");
    await db.insert(siteSettings).values({
      key: "global",
      config: defaultSiteSettings,
      updatedAt: new Date(),
    });
    console.log("Default settings inserted.");
  } else {
    console.log("Settings row already exists.");
  }

  console.log("Done.");
  process.exit(0);
}

ensureSiteSettingsTable().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
