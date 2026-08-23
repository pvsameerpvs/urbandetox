import { absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * BreadcrumbList for the nested routes: /detox/[destinationSlug] and
 * /detox/[destinationSlug]/[packageSlug], plus /guide/[slug]. The trail must
 * match the visible navigation path; every URL here is a real, indexable route.
 */
export function buildBreadcrumbNode(path: string, crumbs: Crumb[]): JsonLdNode | null {
  if (crumbs.length < 2) return null;
  return prune({
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) =>
      prune({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: absoluteUrl(c.path),
      })
    ),
  });
}
