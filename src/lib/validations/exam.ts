import { z } from "zod";

export const examSectionItemSchema = z.object({
  sectionId: z.string(),
  mcqUids: z.array(z.string()),
  order: z.number().default(0),
});

export const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  organizationId: z.string().optional().nullable(),
  totalTime: z.number().min(1, "Total time must be at least 1 minute"),
  startTime: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  endTime: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  perCorrectMark: z.number().default(1),
  perWrongMark: z.number().default(0.25),
  passMark: z.number().optional().nullable(),
  isLive: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  sections: z.array(examSectionItemSchema).min(1, "At least one section is required"),
});

export type ExamInput = z.infer<typeof examSchema>;
