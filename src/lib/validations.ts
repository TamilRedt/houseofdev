import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  companyName: z.string().min(2, "Enter your company name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid phone number"),
  industry: z.string().min(2, "Select or enter your industry"),
  budget: z.string().min(2, "Select a budget range"),
  serviceRequired: z.string().min(2, "Select a service"),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().min(10, "Tell us a little about the project"),
  website: z.string().optional(),
});

export const careerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid phone number"),
  role: z.string().min(2, "Select a role"),
  portfolio: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  message: z.string().min(10, "Share why you are interested"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type CareerInput = z.infer<typeof careerSchema>;

