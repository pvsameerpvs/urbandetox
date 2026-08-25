-- Make the seed genuinely idempotent for the two tables that had no natural key.
--
-- seed.ts inserts with .onConflictDoNothing(), but stripId() drops the primary
-- key so a fresh UUID is generated on every run, and ON CONFLICT DO NOTHING
-- only fires when there is a constraint to violate. testimonials and faqs had
-- none, so each seed run appended a complete second copy: testimonials had 10
-- rows for 5 real people, faqs had 20 for 10 questions. Both were user-visible,
-- the homepage showed the same two reviewers twice and /faqs published every
-- question twice inside its FAQPage markup.
--
-- guides, destinations, packages and seasonal_tags were unaffected because each
-- already has a unique slug for ON CONFLICT to catch.
--
-- Duplicates were removed before this ran, so these can be created safely.
CREATE UNIQUE INDEX IF NOT EXISTS "testimonials_name_quote_key"
  ON "testimonials" ("name", "quote");

CREATE UNIQUE INDEX IF NOT EXISTS "faqs_question_key"
  ON "faqs" ("question");
