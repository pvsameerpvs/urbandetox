-- Two features, one additive migration.
--
-- 1. guide_applications: people applying to work as trip guides. Deliberately
--    NOT the `guides` table, which holds travel articles.
-- 2. booking_share_links: lets an admin send a customer a link to fill their
--    traveller details without creating an account. The token itself is never
--    stored, only a SHA-256 hash of it, so a database leak cannot be replayed.

CREATE TABLE IF NOT EXISTS "guide_applications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "city" varchar(255),
  -- destination slugs the applicant wants to guide
  "destinations" jsonb DEFAULT '[]'::jsonb NOT NULL,
  -- languages spoken, which is how guides get matched to a region
  "languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "experience_years" integer,
  "experience" text,
  "about" text,
  "instagram" varchar(255),
  "resume_url" text,
  "photo_url" text,
  -- new | reviewing | shortlisted | rejected | hired
  "status" varchar(20) DEFAULT 'new' NOT NULL,
  "admin_notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "guide_applications_status_idx" ON "guide_applications" ("status");
CREATE INDEX IF NOT EXISTS "guide_applications_created_at_idx" ON "guide_applications" ("created_at");
-- One live application per email; re-applying updates the existing row.
CREATE UNIQUE INDEX IF NOT EXISTS "guide_applications_email_key" ON "guide_applications" (lower("email"));

CREATE TABLE IF NOT EXISTS "booking_share_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "booking_id" uuid NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
  -- SHA-256 of the token. The token is shown once, at creation, and never stored.
  "token_hash" varchar(64) NOT NULL UNIQUE,
  "created_by" uuid REFERENCES "users"("id"),
  "expires_at" timestamp NOT NULL,
  "revoked_at" timestamp,
  "last_used_at" timestamp,
  "use_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "booking_share_links_booking_id_idx" ON "booking_share_links" ("booking_id");
CREATE INDEX IF NOT EXISTS "booking_share_links_expires_at_idx" ON "booking_share_links" ("expires_at");
