export type JsonLdNode = Record<string, unknown>;

/**
 * Drops undefined, null, empty strings and empty arrays. Schema.org treats an
 * absent property and a property set to "" very differently: the second is a
 * claim that the value is blank, and validators flag it.
 */
export function prune<T extends JsonLdNode>(node: T): T {
  const out: JsonLdNode = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}
