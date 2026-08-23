import { SITE_URL, absoluteUrl as siteAbsoluteUrl } from "@/lib/site";

/**
 * Structured-data identity, layered on the single origin in lib/site.ts so the
 * @graph, metadataBase, sitemap and robots can never disagree about the host.
 */
export { SITE_URL };

/** Stable node identities so every page's @graph refers to one brand entity. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Like lib/site.ts absoluteUrl, but passes an already-absolute URL through
 * untouched. Image fields carry Cloudflare R2 URLs on a different host, so
 * prefixing them with the site origin would produce a dead link.
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return siteAbsoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

/**
 * Most packages and departures currently carry a flat 10000 INR stand-in, so
 * publishing it as an Offer price would advertise a number nobody intends to
 * honour. Pricing markup stays off until the flag is set AND the value is not
 * the sentinel, which means a single env var re-enables it once real prices
 * land, with no code change.
 */
const PLACEHOLDER_PRICE = 10000;

export const pricingEnabled = process.env.NEXT_PUBLIC_SCHEMA_PRICING === "true";

export function publishablePrice(amount?: number | null): number | null {
  if (!pricingEnabled) return null;
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  if (amount <= 0 || amount === PLACEHOLDER_PRICE) return null;
  return amount;
}
