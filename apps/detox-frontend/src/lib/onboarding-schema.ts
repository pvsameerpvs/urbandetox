import { z } from "zod";

export const travelerSchema = z.object({
  id: z.string(),
  type: z.enum(["primary", "companion"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().default(""),
  dateOfBirth: z.string().default(""),
  gender: z.string().default(""),
  // No default: an unanswered meal preference must stay unanswered rather
  // than silently becoming "vegetarian" on the booking record.
  foodPreference: z.string().default(""),
  allergies: z.string().default(""),
  medicalConditions: z.string().default(""),
  bloodGroup: z.string().default(""),
  photoUrl: z.string().default(""),
  idUrl: z.string().optional().default(""),
  idType: z.string().optional().default(""),
  emergencyName: z.string().min(2, "Emergency contact name is required").default(""),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required").default(""),
  emergencyRelation: z.string().min(1, "Please select a relationship").default(""),
});

export const onboardingFormSchema = z.object({
  travelers: z.array(travelerSchema),
  groupNote: z.string().default(""),
  modeOfArrival: z.string().min(1, "Please select your mode of arrival"),
  needsTravelHelp: z.boolean().default(false),
  confirmed: z.literal(true, { message: "Please confirm the details before submitting" }),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export function getStepFieldPaths(step: number, travelerCount: number): string[] {
  const paths: string[] = [];
  switch (step) {
    case 1:
      for (let i = 0; i < travelerCount; i++) {
        paths.push(`travelers.${i}.name`, `travelers.${i}.phone`);
      }
      break;
    case 2:
      break;
    case 3:
      for (let i = 0; i < travelerCount; i++) {
        paths.push(
          `travelers.${i}.emergencyName`,
          `travelers.${i}.emergencyPhone`,
          `travelers.${i}.emergencyRelation`,
        );
      }
      break;
    case 4:
      paths.push("modeOfArrival", "confirmed");
      break;
  }
  return paths;
}
