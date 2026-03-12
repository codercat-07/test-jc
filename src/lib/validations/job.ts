import { z } from "zod";

export const jobNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organizationId: z.string().min(1, "Organization is required"),
  category: z.enum(["GOV", "BANK", "PRIVATE", "OTHER"]).default("GOV"),
  publishedAt: z.string().transform(val => new Date(val)),
  deadline: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  circularImage: z.string().optional().nullable(),
  content: z.any().optional(),
  applicationUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type JobNoticeInput = z.infer<typeof jobNoticeSchema>;
