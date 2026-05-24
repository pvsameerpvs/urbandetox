DO $$ BEGIN
    CREATE TYPE "public"."trip_status" AS ENUM('finished', 'canceled', 'postponed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "departures" ADD COLUMN IF NOT EXISTS "trip_status" "trip_status";
