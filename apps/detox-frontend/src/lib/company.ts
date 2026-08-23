/**
 * The registered legal entity behind the Urban Detox brand.
 *
 * These values were already in the codebase, but only inside
 * `src/app/terms/terms-content.ts` — a controlled legal document that
 * `src/lib/**` should not import from. Hoisting them here lets the JSON-LD
 * builders, `/llms.txt` and the terms page all cite one entity record, which
 * is the whole point of NAP consistency: an answer engine that sees the same
 * name, address and phone in three places treats it as a fact rather than a
 * guess.
 *
 * NOT yet a single source of truth. `src/app/terms/terms-content.ts` still
 * declares its own `COMPANY` at the top of the file, with a different shape
 * (`website`, `registeredOffice` as one string). The values agree today, and
 * they were copied from there, but they are two records that can drift.
 *
 * Deliberately left duplicated: terms-content.ts is a controlled legal
 * document whose text was submitted to Razorpay and reviewed, so it is not
 * edited as a side effect of an SEO change. If these ever disagree, the terms
 * page is authoritative and this file is the one to correct.
 */
export const COMPANY = {
  legalName: "UD GLOBAL PRIVATE LIMITED",
  /** Trading name. Every public surface uses this, not the legal name. */
  tradingName: "Urban Detox",
  streetAddress: "648/A, 4th Floor, OM CHAMBERS, INDIRA NAGAR",
  addressLocality: "Bengaluru",
  /** Kept because the legal copy spells the district out. */
  addressDistrict: "Bengaluru Urban",
  addressRegion: "Karnataka",
  postalCode: "560038",
  addressCountry: "IN",
  email: "hello@urbandetox.in",
  /** E.164, which is the form schema.org and Google Business Profile want. */
  phone: "+919886639393",
  /**
   * The Framer marketing site, NOT this app.
   *
   * This matters for entity resolution: the brand currently lives on two
   * hostnames, and the legal copy names www as the operator's website. Left as
   * the canonical brand URL on purpose — see `buildOrganizationNode`, which
   * emits it in `sameAs` so the two hosts resolve to one organization instead
   * of competing as two.
   */
  brandWebsite: "https://www.urbandetox.in/",
} as const;

/** One-line postal address, for plain-text surfaces like /llms.txt. */
export const COMPANY_ADDRESS_LINE = [
  COMPANY.streetAddress,
  COMPANY.addressLocality,
  COMPANY.addressDistrict,
  COMPANY.addressRegion,
  COMPANY.postalCode,
].join(", ");
