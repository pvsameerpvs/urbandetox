import { z } from "zod";

export const loginFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
