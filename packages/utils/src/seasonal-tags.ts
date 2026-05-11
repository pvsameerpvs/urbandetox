import type { SeasonalTag } from "./types";

export const initialSeasonalTags: SeasonalTag[] = [
  { id: "st_summer", name: "Summer Escape", slug: "summer-escape", iconName: "Sun", label: "Summer Escapes", sortOrder: 1 },
  { id: "st_monsoon", name: "Monsoon Detox", slug: "monsoon-detox", iconName: "CloudRain", label: "Monsoon Escapes", sortOrder: 2 },
  { id: "st_coastal", name: "Coastal Detox", slug: "coastal-detox", iconName: "Waves", label: "Coastal Retreats", sortOrder: 3 },
  { id: "st_extended", name: "Extended Detox", slug: "extended-detox", iconName: "Mountain", label: "Extended Journeys", sortOrder: 4 },
];
