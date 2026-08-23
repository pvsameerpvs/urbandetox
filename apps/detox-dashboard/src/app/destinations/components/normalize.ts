import {
  CONTENT_STATUSES,
  DESTINATION_TYPES,
  type ContentStatus,
  type DestinationType,
} from "@urbandetox/utils";
import type { DestinationFormData } from "./DestinationForm";

/**
 * Adapts form values to what the API accepts. Chip groups and selects hand back
 * plain strings; values are checked against the taxonomy at runtime so unknown
 * entries are dropped rather than cast through.
 */
export function normalizeDestinationPayload(data: DestinationFormData) {
  const allowedTypes = new Set<string>(DESTINATION_TYPES.map((t) => t.value));
  const { destinationTypes: _t, status: _s, ...rest } = data;

  return {
    ...rest,
    destinationTypes: (data.destinationTypes ?? []).filter(
      (v): v is DestinationType => allowedTypes.has(v)
    ),
    status:
      CONTENT_STATUSES.find((s) => s.value === data.status)?.value ??
      ("active" as ContentStatus),
  };
}
