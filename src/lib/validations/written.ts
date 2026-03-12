import { z } from "zod";

export const writtenExamSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  subjectId: z.string().optional().nullable(),
  content: z.any().optional(),
  solution: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export type WrittenExamInput = z.infer<typeof writtenExamSchema>;
