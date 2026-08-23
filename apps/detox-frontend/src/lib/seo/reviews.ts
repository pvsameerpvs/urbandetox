import type { Testimonial } from "@urbandetox/utils";
import { ORG_ID } from "./site";
import { prune, type JsonLdNode } from "./types";

/**
 * Review and AggregateRating markup, deliberately hard to misuse.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT WIRED INTO ANY PAGE, ON PURPOSE. Read this before importing it.
 *
 * There is currently no page where emitting these would be both legitimate and
 * useful, so nothing calls this module yet:
 *
 *   - The homepage renders four real testimonials, but they are about the brand
 *     as a whole. Marking those up with itemReviewed pointing at the
 *     Organization is exactly the self-serving review pattern Google's spam
 *     policy names, so it is not done.
 *   - The package page is the one place a trip-specific rating would belong,
 *     but PackageDetailClient renders no testimonials today. Marking up quotes
 *     the visitor cannot see is invisible marked-up content, which is a manual
 *     action risk, not just a dropped rich result.
 *
 * To enable: add a testimonials block to the package page rendering
 * testimonialsForDestination(all, pkg.destinationSlug), then in
 * app/detox/[destinationSlug]/[packageSlug]/page.tsx pass that same array to
 * buildReviewNodes(tripId(pkg), shown) and attach
 * buildAggregateRatingNode(shown) onto the TouristTrip node. Expect thin
 * coverage: the seeded set is 5 rows spread over kodaikanal, north-kerala and
 * gokarna, so with MIN_REVIEWS_FOR_AGGREGATE at 3 most destinations will
 * correctly emit reviews with no aggregate, and 13 of the 16 destinations will
 * emit nothing. That is the honest outcome, not a bug to tune away.
 *
 * Note that Google supports review snippets for Product, Event, Recipe, Course
 * and a short list of others — not for Trip or TouristTrip. So even once wired,
 * the payoff is machine-readable review data for AI answer engines, not stars
 * in the SERP. That is a fine reason to ship it; it is not a ranking lever.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Three rules are encoded here rather than left to the caller's memory:
 *
 * 1. Only testimonials that the page actually renders may be marked up. Google
 *    drops — and can manually action — review markup for reviews that are not
 *    visible on the same page. The `rendered` argument must therefore be the
 *    exact array passed to the React component, not the full table. The
 *    homepage calls fetchTestimonials(4) and the login page fetchTestimonials(2),
 *    so most of the testimonials table is invisible on any given page and must
 *    not be emitted there.
 *
 * 2. `itemReviewed` is never the Organization. Google does not support review
 *    snippets for self-serving reviews about an Organization or LocalBusiness,
 *    so brand-level rating markup is at best ignored. Pass the @id of the
 *    TouristTrip the reviews are actually about.
 *
 * 3. AggregateRating is computed from the rendered reviews only, and suppressed
 *    below three of them: a lone five-star aggregate reads as manufactured and
 *    buys nothing.
 */
const MIN_REVIEWS_FOR_AGGREGATE = 3;

/**
 * Testimonials that genuinely belong to a destination. testimonials.destination_slug
 * is the only link the table carries, so a row with no slug, or a slug for a
 * different destination, is not evidence about this trip and is dropped.
 */
export function testimonialsForDestination(
  all: Testimonial[],
  destinationSlug: string
): Testimonial[] {
  return all.filter((t) => t.destinationSlug === destinationSlug);
}

export function buildReviewNodes(itemReviewedId: string, rendered: Testimonial[]): JsonLdNode[] {
  return rendered
    .filter((t) => t.quote?.trim() && t.rating >= 1 && t.rating <= 5)
    .map((t) =>
      prune({
        "@type": "Review",
        "@id": `${itemReviewedId.split("#")[0]}#review-${t.id}`,
        itemReviewed: { "@id": itemReviewedId },
        reviewBody: t.quote.trim(),
        // trip_date is a free-text label like "Dec 2025", not a date, so it is
        // not emitted as datePublished. A wrong ISO date is worse than none.
        author: prune({
          "@type": "Person",
          name: t.name,
          address: t.location || undefined,
        }),
        reviewRating: prune({
          "@type": "Rating",
          ratingValue: t.rating,
          bestRating: 5,
          worstRating: 1,
        }),
        publisher: { "@id": ORG_ID },
      })
    );
}

export function buildAggregateRatingNode(rendered: Testimonial[]): JsonLdNode | null {
  const rated = rendered.filter((t) => t.rating >= 1 && t.rating <= 5);
  if (rated.length < MIN_REVIEWS_FOR_AGGREGATE) return null;

  const mean = rated.reduce((sum, t) => sum + t.rating, 0) / rated.length;
  return prune({
    "@type": "AggregateRating",
    ratingValue: Number(mean.toFixed(1)),
    reviewCount: rated.length,
    bestRating: 5,
    worstRating: 1,
  });
}
