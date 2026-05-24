DO $$ BEGIN
    CREATE TYPE "public"."departure_status" AS ENUM('open', 'filling', 'full', 'closed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"departure_code" varchar(50) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"travelers" integer DEFAULT 1 NOT NULL,
	"status" varchar(50) DEFAULT 'confirmed' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"package_slug" varchar(255) NOT NULL,
	"destination_slug" varchar(255) NOT NULL,
	"start_date" varchar(20) NOT NULL,
	"end_date" varchar(20) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"offer_price" numeric(10, 2),
	"seats_total" integer NOT NULL,
	"seats_left" integer NOT NULL,
	"status" "departure_status" DEFAULT 'open' NOT NULL,
	CONSTRAINT "departures_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"meeting_point" varchar(255) NOT NULL,
	"vibe" varchar(255) NOT NULL,
	CONSTRAINT "destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"destination_slug" varchar(255),
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"image" text NOT NULL,
	"related_package_slugs" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"destination_slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255) NOT NULL,
	"duration" integer NOT NULL,
	"duration_label" varchar(100) NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb,
	"itinerary" jsonb,
	"included" jsonb DEFAULT '[]'::jsonb,
	"not_included" jsonb DEFAULT '[]'::jsonb,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"faqs" jsonb DEFAULT '[]'::jsonb,
	"cover_image" text NOT NULL,
	"starting_price" numeric(10, 2) NOT NULL,
	"group_size" varchar(50) NOT NULL,
	"style" varchar(100) NOT NULL,
	"guide_led" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"seasonal_tag" varchar(100),
	CONSTRAINT "packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seasonal_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"icon_name" varchar(50) NOT NULL,
	"label" varchar(100) NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "seasonal_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"quote" text NOT NULL,
	"image" text,
	"destination_slug" varchar(255),
	"trip_date" varchar(20),
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"phone" varchar(50),
	"date_of_birth" varchar(20),
	"gender" varchar(50),
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
