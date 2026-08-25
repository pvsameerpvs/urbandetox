import { COMPANY } from "@/lib/company";
import { ORG_ID, absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

/**
 * The local-guide matching service.
 *
 * /local-guides previously emitted only a BreadcrumbList, so nothing on the
 * page said what was being offered in machine-readable form.
 *
 * Deliberately omits `offers` and any price. There is no published rate: the
 * page takes a request and we come back with what a guide charges, so
 * asserting a price or a currency here would be inventing one. Service is not
 * eligible for a rich result on its own, so the payoff is machine readability
 * for answer engines rather than anything visible in the SERP.
 *
 * areaServed is stated as the countries we actually operate in rather than a
 * list of destination slugs, because the whole point of the page is that the
 * request is not limited to places we run trips to.
 */
export function buildLocalGuideServiceNode(countries: string[]): JsonLdNode {
  return prune({
    "@type": "Service",
    "@id": `${absoluteUrl("/local-guides")}#service`,
    name: "Hire a local guide",
    serviceType: "Local guide matching",
    description:
      "Tell us the location and dates and we introduce you to a local guide who lives there. Available beyond the destinations we run trips to.",
    provider: { "@id": ORG_ID },
    areaServed: countries.map((name) => ({ "@type": "Country", name })),
    availableChannel: prune({
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/local-guides"),
      servicePhone: COMPANY.phone,
      availableLanguage: ["en", "hi", "kn", "ml", "ta"],
    }),
  });
}
