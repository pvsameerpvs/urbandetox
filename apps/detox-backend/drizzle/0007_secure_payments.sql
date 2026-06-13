ALTER TABLE "departures" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "checkout_session_id" uuid;
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

CREATE TABLE IF NOT EXISTS "checkout_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "idempotency_key" varchar(100) NOT NULL,
  "user_id" uuid NOT NULL,
  "departure_code" varchar(50) NOT NULL,
  "traveler_count" integer NOT NULL,
  "customer_name" varchar(255) NOT NULL,
  "customer_phone" varchar(50) NOT NULL,
  "customer_email" varchar(255) NOT NULL,
  "subtotal_paise" integer NOT NULL,
  "gst_paise" integer NOT NULL,
  "total_paise" integer NOT NULL,
  "currency" varchar(10) DEFAULT 'INR' NOT NULL,
  "status" varchar(50) DEFAULT 'created' NOT NULL,
  "razorpay_order_id" varchar(100),
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "checkout_sessions_idempotency_key_unique" UNIQUE("idempotency_key"),
  CONSTRAINT "checkout_sessions_razorpay_order_id_unique" UNIQUE("razorpay_order_id"),
  CONSTRAINT "checkout_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "seat_holds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "checkout_session_id" uuid NOT NULL,
  "departure_code" varchar(50) NOT NULL,
  "seats" integer NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "seat_holds_checkout_session_id_unique" UNIQUE("checkout_session_id"),
  CONSTRAINT "seat_holds_checkout_session_id_checkout_sessions_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE no action ON UPDATE no action
);

DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_checkout_session_id_checkout_sessions_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_checkout_session_id_unique" ON "bookings" USING btree ("checkout_session_id");

CREATE TABLE IF NOT EXISTS "payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "checkout_session_id" uuid NOT NULL,
  "booking_id" uuid,
  "razorpay_order_id" varchar(100) NOT NULL,
  "razorpay_payment_id" varchar(100) NOT NULL,
  "amount_paise" integer NOT NULL,
  "amount_refunded_paise" integer DEFAULT 0 NOT NULL,
  "currency" varchar(10) NOT NULL,
  "status" varchar(50) NOT NULL,
  "method" varchar(50),
  "signature_verified" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "payments_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id"),
  CONSTRAINT "payments_checkout_session_id_checkout_sessions_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE no action ON UPDATE no action,
  CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "refunds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "payment_id" uuid NOT NULL,
  "razorpay_refund_id" varchar(100) NOT NULL,
  "idempotency_key" varchar(100) NOT NULL,
  "amount_paise" integer NOT NULL,
  "status" varchar(50) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "refunds_razorpay_refund_id_unique" UNIQUE("razorpay_refund_id"),
  CONSTRAINT "refunds_idempotency_key_unique" UNIQUE("idempotency_key"),
  CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "webhook_events" (
  "event_id" varchar(100) PRIMARY KEY NOT NULL,
  "event_type" varchar(100) NOT NULL,
  "processed_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "checkout_sessions_user_id_idx" ON "checkout_sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "checkout_sessions_departure_code_idx" ON "checkout_sessions" ("departure_code");
CREATE INDEX IF NOT EXISTS "seat_holds_departure_status_expires_idx" ON "seat_holds" ("departure_code", "status", "expires_at");
CREATE INDEX IF NOT EXISTS "payments_order_id_idx" ON "payments" ("razorpay_order_id");

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "checkout_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seat_holds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "refunds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "users", "bookings", "checkout_sessions", "seat_holds", "payments", "refunds", "webhook_events" FROM anon, authenticated;
