import { z } from "zod";

export const departureFormSchema = z.object({
  code: z.string().optional(),
  packageSlug: z.string().min(1, "Package is required"),
  destinationSlug: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  offerPrice: z.number().min(0, "Offer price must be 0 or more"),
  seatsTotal: z.number().min(1, "Must have at least 1 seat"),
  seatsLeft: z.number().min(0, "Seats left cannot be negative"),
  status: z.enum(["open", "filling", "full", "closed"]),
  tripStatus: z.enum(["finished", "canceled", "postponed"]).optional(),
  image: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export type DepartureFormData = z.infer<typeof departureFormSchema>;

export function toSelectValue(v: string | undefined): string | undefined {
  return v && v.length > 0 ? v : undefined;
}
