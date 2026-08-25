import { COMPANY } from "@/lib/company";
import { SITE_URL } from "@/lib/site";

/**
 * RFC 9116 security.txt.
 *
 * This site takes payments and holds traveller PII, including government ID
 * documents, so there should be an obvious place for someone who finds a
 * problem to report it. Without this, a researcher's options are the public
 * contact form or nothing, and "nothing" usually means it gets disclosed
 * somewhere else first.
 *
 * Expires is required by the RFC and must be in the future, so it is computed
 * a year out at request time rather than hardcoded to a date that quietly goes
 * stale and makes the file invalid.
 */
export const revalidate = 86400;

export function GET() {
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    `Contact: mailto:${COMPANY.email}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "",
    "# Please report privately first and give us a chance to fix it.",
    "# Traveller documents and payment data are the areas we care most about.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
