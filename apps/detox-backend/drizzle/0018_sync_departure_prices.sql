-- One trip, one price.
--
-- packages.starting_price and departures.price were edited and stored
-- independently, and the frontend read them in different places: listing
-- cards and the mobile CTA used the package price, while the trip detail
-- sidebar, the Dates list, the booking page and the payment amount used the
-- departure price. Nothing kept them in step, so the same trip advertised two
-- numbers. The seed had also left many departures on the flat 10000 INR
-- stand-in while the real price lived on the package, which is exactly the
-- drift users saw.
--
-- The package price is now the single source of truth and every batch
-- inherits it. This backfills existing rows so no trip shows a stale or
-- placeholder number. A real per-batch discount (offer price actually below
-- the batch price) is preserved. Anything else is cleared: an "offer" at or
-- above the batch price was never a discount, and 10000 is the seed's flat
-- stand-in (see apps/detox-frontend/src/lib/seo/site.ts), which some rows
-- still carry even where the batch price was already corrected. Column
-- references in the CASE read the pre-update values, which is what we want.
UPDATE "departures"
SET
  "price" = "packages"."starting_price",
  "offer_price" = CASE
    WHEN "departures"."offer_price" >= "departures"."price"
      OR "departures"."offer_price" = 10000
    THEN NULL
    ELSE "departures"."offer_price"
  END
FROM "packages"
WHERE "departures"."package_slug" = "packages"."slug";
