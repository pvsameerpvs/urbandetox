import { safeImageUrl, type Destination, type GuideArticle } from "@urbandetox/utils";
import { ORG_ID, absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

/**
 * Article for /guide/[slug]. The guides table has no published/updated
 * timestamps, so datePublished and dateModified are deliberately absent rather
 * than filled with the render time — a fabricated freshness signal is worse
 * than a missing one, and Google reads dateModified literally.
 */
export function buildArticleNode(guide: GuideArticle, dest?: Destination): JsonLdNode {
  const url = absoluteUrl(`/guide/${guide.slug}`);
  return prune({
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.excerpt,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(safeImageUrl(guide.image)),
    articleSection: guide.category,
    about: dest ? prune({ "@type": "TouristDestination", name: dest.name }) : undefined,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  });
}
