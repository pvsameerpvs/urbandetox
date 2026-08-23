import { z } from "zod";

/** Languages that matter for guiding, in the priority order the brand uses. */
export const GUIDE_LANGUAGES = [
  "Malayalam",
  "Tamil",
  "Kannada",
  "Hindi",
  "English",
  "Telugu",
  "Marathi",
] as const;

export const guideApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(50),
  city: z.string().trim().min(2, "Which city are you based in?"),
  destinations: z.array(z.string()).min(1, "Pick at least one destination"),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
  experienceYears: z.number().int().min(0, "Cannot be negative").max(60),
  experience: z.string().trim().max(3000).optional(),
  about: z.string().trim().min(20, "Tell us a little more, at least 20 characters").max(3000),
  instagram: z.string().trim().max(255).optional(),
});

export type GuideApplicationValues = z.infer<typeof guideApplicationSchema>;
