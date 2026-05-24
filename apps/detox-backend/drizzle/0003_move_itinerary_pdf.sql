ALTER TABLE "destinations" DROP COLUMN IF EXISTS "itinerary_pdf";--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "itinerary_pdf" text;