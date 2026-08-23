-- SEO and accessibility fields for guide articles.
--
-- The guides table carried only image, with no alt text, no per-article meta
-- and no timestamp. Consequences: every article image was announced to screen
-- readers by its title (the component falls back to alt={title}), the sitemap
-- had no lastmod to report for guides, and per-article titles and descriptions
-- had to be derived from the body.
--
-- All additive and nullable except updated_at, which defaults, so existing rows
-- are untouched.
ALTER TABLE "guides" ADD COLUMN IF NOT EXISTS "image_alt" text;
ALTER TABLE "guides" ADD COLUMN IF NOT EXISTS "seo_title" varchar(255);
ALTER TABLE "guides" ADD COLUMN IF NOT EXISTS "seo_description" text;
ALTER TABLE "guides" ADD COLUMN IF NOT EXISTS "updated_at" timestamp NOT NULL DEFAULT now();
