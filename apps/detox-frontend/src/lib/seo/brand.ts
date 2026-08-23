import { BRAND, defaultSiteSettings, type SiteSettings } from "@urbandetox/utils";
import { ORG_ID, SITE_URL, WEBSITE_ID, absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

/** Square wordmark in public/. See the logo node below for why not fevic.png. */
const LOGO_PATH = "/urban-detox-logo-dark.png";

/**
 * TravelAgency, not Organization or LocalBusiness.
 *
 * Urban Detox runs its own guide-led departures, which makes it a tour
 * operator; schema.org has no TourOperator type and TravelAgency is the closest
 * subtype. TravelAgency inherits from LocalBusiness, so search engines will
 * look for a postal address: we only know "Bangalore, India", so the address is
 * emitted city-only with no fabricated streetAddress. Add the registered
 * address (and a Google Business Profile URL as sameAs) to earn local results.
 */
export function buildOrganizationNode(settings?: SiteSettings | null): JsonLdNode {
  const links = (settings?.socialLinks ?? defaultSiteSettings.socialLinks)
    .filter((s) => s.enabled && s.url.trim().length > 0)
    .map((s) => s.url.trim());

  const whatsapp = (settings?.whatsappNumber ?? BRAND.contact.whatsappNumber).trim();

  return prune({
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: BRAND.name,
    slogan: BRAND.tagline,
    url: SITE_URL,
    // public/fevic.png is 104x100, which is under the 112px floor Google states
    // for a logo image, and it is a favicon crop rather than the wordmark.
    // public/urban-detox-logo-dark.png is the real 642x642 square wordmark and
    // is tracked at mode 100755, so it survives a fresh Railway checkout.
    // width/height are declared because ImageObject without them makes the
    // crawler fetch the file just to learn its size.
    logo: prune({
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absoluteUrl(LOGO_PATH),
      contentUrl: absoluteUrl(LOGO_PATH),
      width: 642,
      height: 642,
      caption: BRAND.name,
    }),
    image: { "@id": `${SITE_URL}/#logo` },
    email: BRAND.contact.email,
    telephone: BRAND.contact.phone,
    address: prune({
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    }),
    areaServed: prune({ "@type": "Country", name: "India" }),
    sameAs: links,
    contactPoint: [
      prune({
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND.contact.email,
        telephone: BRAND.contact.phone,
        url: whatsapp ? `https://wa.me/${whatsapp}` : undefined,
      }),
    ],
  });
}

/**
 * SearchAction points at /detox?q=, which is the only real search entry point:
 * apps/detox-frontend/src/app/detox/page.tsx reads `q` from searchParams and
 * forwards it to the API as the `q` filter.
 */
export function buildWebSiteNode(): JsonLdNode {
  return prune({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BRAND.name,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/detox?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  });
}
