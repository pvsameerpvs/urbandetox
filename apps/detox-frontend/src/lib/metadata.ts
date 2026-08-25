import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Per-route metadata helpers. Named `metadata.ts` rather than `seo.ts` because
 * `src/lib/seo/` already exists for JSON-LD builders and a file plus a
 * directory of the same name both resolve as `@/lib/seo`.
 */

export const SITE_NAME = "Urban Detox";

export const DEFAULT_TITLE =
  "Urban Detox — Disconnect from routine. Step into your next detox.";

export const DEFAULT_DESCRIPTION =
  "Curated offbeat escapes for a real reset. Small-group detox trips from Bengaluru to Kodaikanal, North Kerala, Gokarna and beyond — ten travellers per departure.";

/** og:site_name and og:locale, reused by every page that builds its own card. */
/**
 * Share card used by any route that has no image of its own.
 *
 * 1200x630, the canonical Open Graph size. It is the branded cover, which is
 * the right choice here precisely because the logo is baked in: a share card
 * wants the brand on it, which is the same reason this image must never be
 * used as a destination or trip cover.
 */
export const DEFAULT_OG_IMAGE = {
  url: "https://pub-f5b50eb029e5430db1a9767ba1ee3421.r2.dev/marketing/og/urban-detox-og.jpg",
  width: 1200,
  height: 630,
  alt: "Urban Detox, small-group offbeat trips in South India",
};

export const OG_BASE = { siteName: SITE_NAME, locale: "en_IN" } as const;

/** metadataBase for the root layout. Same origin as robots.ts and sitemap.ts. */
export const METADATA_BASE = new URL(SITE_URL);

/** Collapse whitespace, then cut at a word boundary near the SERP limit. */
export function clamp(text: string, max = 158): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = cut.lastIndexOf(" ");
  return `${(stop > 0 ? cut.slice(0, stop) : cut).replace(/[,;:.–-]$/, "")}…`;
}

/**
 * `seo_title` values in the database already end in "| Urban Detox", so
 * returning a bare string would let the root `title.template` append the brand
 * a second time. Anything already carrying the brand is marked absolute;
 * our own composed fallbacks stay plain so the template can brand them.
 */
export function dbTitle(
  seoTitle: string | null | undefined,
  fallback: string
): NonNullable<Metadata["title"]> {
  const t = seoTitle?.trim();
  if (!t) return fallback;
  return /urban\s*detox/i.test(t) ? { absolute: t } : t;
}

/**
 * Canonical, og:url and og:image for one route.
 *
 * openGraph is written out in full on purpose. The Next 16 docs are explicit
 * that the merge is shallow per key: "All `openGraph` fields from
 * `app/layout.js` are **inherited** in `app/about/page.js` because
 * `app/about/page.js` doesn't set `openGraph` metadata" — so a page that sets
 * openGraph replaces the root object rather than patching it.
 *
 * og:title and og:description are deliberately omitted. Next's
 * `inheritFromMetadata` copies `title` and `description` (only those two) onto
 * openGraph and twitter from the page's own top-level values, so repeating
 * them here would only create a second place to keep in sync.
 */
export function routeSeo(input: {
  /** Route path, leading slash, no query string. */
  path: string;
  image?: string | null;
  imageAlt?: string | null;
}): Pick<Metadata, "alternates" | "openGraph"> {
  const { path, image, imageAlt } = input;
  /**
   * Falls back to the brand card rather than omitting images.
   *
   * openGraph merges shallow per key, so a route that sets openGraph replaces
   * the root object outright. Leaving images off here therefore did not inherit
   * the root's image, it removed it, and every static route shared with no
   * picture at all.
   */
  const images = image
    ? [{ url: image, alt: imageAlt || SITE_NAME }]
    : [DEFAULT_OG_IMAGE];
  return {
    alternates: { canonical: path },
    openGraph: {
      ...OG_BASE,
      type: "website",
      url: path,
      images,
    },
  };
}

/** Applied to every route that must never reach an index. */
export const NOINDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};
