DO $$ BEGIN
  ALTER TABLE "bookings"
    ADD CONSTRAINT "bookings_checkout_session_id_required"
    CHECK ("checkout_session_id" IS NOT NULL) NOT VALID;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "bookings" VALIDATE CONSTRAINT "bookings_user_id_required";
ALTER TABLE "bookings" VALIDATE CONSTRAINT "bookings_checkout_session_id_required";

ALTER TABLE "bookings" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "bookings" ALTER COLUMN "checkout_session_id" SET NOT NULL;

ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_required";
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_checkout_session_id_required";
