import { z } from "zod";

export const mcqOptionSchema = z.object({
  id: z.string(),
  text: z.any(), // Tiptap JSON
  textPlain: z.string(),
  isCorrect: z.boolean(),
});

export const mcqSchema = z.object({
  question: z.any(), // Tiptap JSON
  questionPlain: z.string().min(1, "Question text is required"),
  options: z.array(mcqOptionSchema).min(2, "At least 2 options are required"),
  explanation: z.any().optional(),
  subjectId: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  subtopicId: z.string().optional().nullable(),
  organizationId: z.string().optional().nullable(),
  examHeading: z.string().optional(),
  examDate: z.date().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export type McqInput = z.infer<typeof mcqSchema>;
export type McqOptionInput = z.infer<typeof mcqOptionSchema>;
