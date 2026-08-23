/**
 * The one origin this app calls its own.
 *
 * Consumed by `metadataBase`, per-page canonicals, `sitemap.ts` and
 * `robots.ts` so those four can never disagree about which host is real.
 *
 * Precedence matches `src/app/auth/callback/route.ts` (`SITE_URL` first) so
 * there is a single variable to set per environment. Today the value is the
 * beta subdomain; when the app moves to the www hostname, change the env var
 * and redeploy — no code edit.
 */
export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://beta.urbandetox.in"
).replace(/\/+$/, "");

/** Absolute URL for an app-relative path. `absoluteUrl("/")` -> origin. */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Route prefixes that must never be crawled or listed: authenticated areas,
 * checkout, tokenised forms and auth callbacks. Kept here so `robots.ts` and
 * `sitemap.ts` share one list.
 */
export const PRIVATE_PREFIXES = [
  "/my-detox",
  "/profile",
  "/book",
  "/form",
  "/login",
  "/reset-password",
  "/auth",
] as const;
