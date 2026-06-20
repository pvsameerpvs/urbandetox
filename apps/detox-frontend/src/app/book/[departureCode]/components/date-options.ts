import type { Departure } from "@urbandetox/utils";

export type AvailableDateOption = Pick<
  Departure,
  "code" | "status" | "seatsLeft" | "price" | "offerPrice" | "startDate" | "endDate" | "tripStatus"
>;
