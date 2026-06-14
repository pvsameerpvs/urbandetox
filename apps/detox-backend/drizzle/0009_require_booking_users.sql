DO $$ BEGIN
  ALTER TABLE "bookings"
    ADD CONSTRAINT "bookings_user_id_required"
    CHECK ("user_id" IS NOT NULL) NOT VALID;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
