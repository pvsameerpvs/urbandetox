-- Swap the functional unique index for a plain one.
--
-- Drizzle's onConflictDoUpdate cannot target an expression index, and the
-- service normalises email to lowercase before writing, so a plain unique
-- index on the column is equivalent and lets upsert work.
DROP INDEX IF EXISTS "guide_applications_email_key";
UPDATE "guide_applications" SET "email" = lower("email") WHERE "email" <> lower("email");
CREATE UNIQUE INDEX IF NOT EXISTS "guide_applications_email_key" ON "guide_applications" ("email");
