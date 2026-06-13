CREATE TABLE IF NOT EXISTS "email_delivery_events" (
  "event_id" varchar(100) PRIMARY KEY NOT NULL,
  "email_id" varchar(100) NOT NULL,
  "event_type" varchar(100) NOT NULL,
  "recipients" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "subject" text,
  "detail" text,
  "occurred_at" timestamp NOT NULL,
  "received_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "email_delivery_events_email_id_idx" ON "email_delivery_events" ("email_id");
CREATE INDEX IF NOT EXISTS "email_delivery_events_type_idx" ON "email_delivery_events" ("event_type");

ALTER TABLE "email_delivery_events" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "email_delivery_events" FROM anon, authenticated;
