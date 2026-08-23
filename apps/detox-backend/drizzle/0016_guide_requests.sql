-- Customer requests to hire a local guide.
--
-- Distinct from guide_applications, which is people applying to BE guides.
-- This is the other direction: a customer wants a guide for a place, possibly
-- one we do not run trips to, so location is free text rather than a slug.
CREATE TABLE IF NOT EXISTS "guide_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(50) NOT NULL,
  -- Free text on purpose: the whole point is "a guide for any location".
  "location" varchar(255) NOT NULL,
  -- Free text too. Most people say "second week of March", not a date.
  "travel_dates" varchar(255),
  "group_size" integer,
  "needs" text,
  "languages" jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- new | contacted | matched | closed
  "status" varchar(20) NOT NULL DEFAULT 'new',
  "admin_notes" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "guide_requests_status_idx" ON "guide_requests" ("status");
CREATE INDEX IF NOT EXISTS "guide_requests_created_idx" ON "guide_requests" ("created_at");
