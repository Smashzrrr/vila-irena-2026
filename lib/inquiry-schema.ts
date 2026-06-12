import { z } from "zod";
import { MAX_GUESTS } from "./config";
import { locales } from "./i18n";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(MAX_GUESTS),
  checkIn: isoDate,
  checkOut: isoDate,
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  locale: z.enum(locales),
  /** Honeypot: real users always submit this empty. */
  website: z.literal("").optional(),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;
