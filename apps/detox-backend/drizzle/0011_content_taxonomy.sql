-- Content taxonomy for filtering, audience targeting and trip logistics.
--
-- Every column is added nullable or with a default, so this is additive and safe
-- to run against live data. No existing row changes meaning, and nothing here is
-- required by the booking or payment path.
--
-- Array-ish columns use jsonb to match the existing convention (gallery,
-- highlights, included, faqs are all jsonb arrays).

-- ── destinations ────────────────────────────────────────────────────────
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "state" varchar(100);
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "country" varchar(100) DEFAULT 'India';
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "best_time_to_visit" varchar(255);
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "travel_time_from_bangalore" varchar(100);
-- hills | beach | forest | backwater | coastal | desert
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "destination_types" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "image_alt" text;
-- active | hidden | coming_soon
ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "status" varchar(20) DEFAULT 'active' NOT NULL;

-- ── packages: filter facets ─────────────────────────────────────────────
-- solo | family | couples | corporate | college | b2b
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "audiences" jsonb DEFAULT '[]'::jsonb;
-- adventure | wellness | relaxation | culture | party
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "themes" jsonb DEFAULT '[]'::jsonb;
-- beach | mountains | forest | backwater
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "terrains" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "is_domestic" boolean DEFAULT true NOT NULL;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "is_weekend" boolean DEFAULT false NOT NULL;
-- easy | moderate | active
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "fitness_level" varchar(20);

-- ── packages: logistics ─────────────────────────────────────────────────
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "pickup_point" varchar(255);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "drop_point" varchar(255);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "pickup_time" varchar(10);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "return_time" varchar(10);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "pickup_map_image" text;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "pickup_map_url" text;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "transport_type" varchar(100);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "stay_type" varchar(100);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "room_sharing" varchar(100);
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "meal_plan" varchar(255);

-- ── packages: trust and pre-trip info ───────────────────────────────────
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "women_friendly" boolean DEFAULT true NOT NULL;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "solo_friendly" boolean DEFAULT true NOT NULL;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "what_to_pack" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "things_to_know" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "cancellation_policy" text;

-- ── packages: SEO and lifecycle ─────────────────────────────────────────
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "seo_title" text;
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "seo_description" text;
-- draft | live | sold_out | coming_soon
ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "status" varchar(20) DEFAULT 'live' NOT NULL;

-- ── departures ──────────────────────────────────────────────────────────
-- Human label for a batch, e.g. "Long Weekend" or "New Year Batch".
ALTER TABLE "departures" ADD COLUMN IF NOT EXISTS "batch_label" varchar(100);

-- ── indexes for the filter queries ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS "packages_status_idx" ON "packages" ("status");
CREATE INDEX IF NOT EXISTS "packages_featured_idx" ON "packages" ("featured");
CREATE INDEX IF NOT EXISTS "packages_destination_slug_idx" ON "packages" ("destination_slug");
CREATE INDEX IF NOT EXISTS "packages_duration_idx" ON "packages" ("duration");
CREATE INDEX IF NOT EXISTS "destinations_status_idx" ON "destinations" ("status");
CREATE INDEX IF NOT EXISTS "departures_start_date_idx" ON "departures" ("start_date");
CREATE INDEX IF NOT EXISTS "departures_package_slug_idx" ON "departures" ("package_slug");
