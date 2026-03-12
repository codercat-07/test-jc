import { z } from "zod";

export const lectureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.any().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  subjectId: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  isFree: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export type LectureInput = z.infer<typeof lectureSchema>;
