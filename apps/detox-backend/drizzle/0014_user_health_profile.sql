-- Traveller preferences on the user record.
--
-- /profile/preferences and /profile/emergency both reported "saved" and showed
-- an "Auto-fills in onboarding" badge, but updateHealth and setEmergencyContacts
-- only ever wrote to localStorage: nothing reached the server. The values were
-- therefore per-device, and lost entirely the moment localStorage was cleared,
-- which now happens on logout so the previous user's medical notes do not leak
-- to the next person on a shared device.
--
-- All additive and nullable, so existing rows are untouched.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "food_preference" varchar(50);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "allergies" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "medical_conditions" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "blood_group" varchar(10);
-- Array of { name, phone, email, relation }.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emergency_contacts" jsonb;
