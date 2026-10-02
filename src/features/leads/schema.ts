import { z } from "zod";

/** Shared by the enquiry form (browser) and functions/api/enquiry.ts (Cloudflare). */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]).optional(),
  project: z.string().max(80).optional(),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal(true, { error: "Please accept to be contacted" }),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Extra context sent with each lead (never shown to the visitor). */
export const enquiryMetaSchema = z.object({
  sourcePage: z.string().max(300).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  turnstileToken: z.string().optional(),
  /** Honeypot: real visitors never fill this. */
  company: z.string().optional(),
});
