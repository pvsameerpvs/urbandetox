import { prune, type JsonLdNode } from "@/lib/seo/types";

interface JsonLdProps {
  /** Unique per script tag on a page, so React never dedupes two graphs. */
  id: string;
  nodes: Array<JsonLdNode | null | undefined>;
}

/**
 * Renders a JSON-LD @graph.
 *
 * The Next.js JSON-LD guide is explicit that this is a plain script tag, not
 * next/script: "Since JSON-LD is structured data, not executable code, a
 * native `<script>` tag is the right choice here." The same guide warns that
 * `JSON.stringify` "does not sanitize malicious strings used in XSS injection"
 * and recommends replacing `<` with its unicode escape, which is what the
 * replace below does. Package titles, FAQ answers and testimonial quotes are
 * all admin-editable, so that escape is load-bearing here, not decorative.
 */
export function JsonLd({ id, nodes }: JsonLdProps) {
  const graph = nodes.filter((n): n is JsonLdNode => Boolean(n)).map(prune);
  if (graph.length === 0) return null;

  const payload = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
