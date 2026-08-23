import type { MetadataRoute } from "next";
import { blockedAiAgents } from "@/lib/ai-crawlers";
import { absoluteUrl, PRIVATE_PREFIXES, SITE_URL } from "@/lib/site";

/**
 * Kept in step with sitemap.ts so the two never describe different sites.
 */
export const revalidate = 3600;

/**
 * Escape hatch for non-canonical hosts. Default is to allow crawling, so
 * nothing changes today; set NEXT_PUBLIC_ALLOW_INDEXING="false" on the host
 * that should stop competing (i.e. beta, once the app is served from www).
 */
const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  /**
   * AI crawler opt-outs, driven by NEXT_PUBLIC_AI_CRAWLER_POLICY. Empty under
   * the default "open" policy, so today's robots.txt is unchanged until
   * somebody makes the call documented in lib/ai-crawlers.ts.
   *
   * Emitted BEFORE the wildcard group: a crawler obeys the single most
   * specific group that names it and ignores every other, so the named group
   * has to exist for the named agent to ever see it.
   */
  const blockedAi = blockedAiAgents();

  return {
    rules: [
      ...(blockedAi.length ? [{ userAgent: blockedAi, disallow: "/" }] : []),
      {
        userAgent: "*",
        /**
         * The scope tabs are the exception to the faceted-navigation block
         * below. They are two stable, linked URLs that split India from
         * international, which the client wants findable, so they are allowed
         * explicitly. Longest-match wins in robots.txt, so this beats the
         * "/detox?" disallow for these two and nothing else.
         */
        allow: ["/", "/detox?scope="],
        disallow: [
          // Authenticated and transactional routes. Bare prefixes on purpose:
          // "Disallow: /profile/" would leave /profile itself crawlable, since
          // robots rules match by string prefix.
          ...PRIVATE_PREFIXES,
          // next.config.mjs rewrites /api/* to the Express backend, so the raw
          // JSON API is crawlable on this origin. Nothing there should be indexed.
          "/api/",
          // Faceted navigation. DetoxFilterBar pushes eight multi-valued keys
          // (audience, theme, terrain, fitness, duration, budget, weekend, q)
          // into the query string, so /detox has a combinatorial number of
          // crawlable variants that are all thin slices of the same 17
          // packages. Only "*" and "$" are special in robots.txt — "?" is a
          // literal — so this blocks "/detox?..." while leaving "/detox" and
          // "/detox/<destination>/<package>" fully crawlable.
          "/detox?",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
