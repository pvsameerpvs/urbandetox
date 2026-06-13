import { z } from "zod";

export const personalSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

export const emergencyContactItemSchema = z.object({
  name: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().optional(),
  relation: z.string().min(1, "Please select a relationship"),
});

export const emergencyContactsSchema = z.array(emergencyContactItemSchema);

export type PersonalFormValues = z.infer<typeof personalSchema>;
