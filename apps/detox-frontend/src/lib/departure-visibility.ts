import type { Departure } from "@urbandetox/utils";
import { isDepartureBookable } from "./departure-availability";

/**
 * The departure rows a package page actually renders.
 *
 * Lifted out of PackageDetailClient so the JSON-LD builder and the UI cannot
 * drift: Event markup for a departure the page does not show is invisible
 * marked-up content, which is exactly what Google's structured-data policy
 * disallows. Behaviour is unchanged from the inline version it replaces.
 */
export function selectVisibleDepartures(
  departures: Departure[],
  selectedCode?: string
): Departure[] {
  const selected = selectedCode
    ? departures.find((d) => d.code === selectedCode)
    : undefined;

  const candidates = departures.filter(
    (d) => isDepartureBookable(d) || d.code === selected?.code
  );

  if (!selected) return candidates.slice(0, 4);

  const list = candidates.slice(0, 4);
  if (!list.some((d) => d.code === selected.code)) list.unshift(selected);
  return list.slice(0, 5);
}
