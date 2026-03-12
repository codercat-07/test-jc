import { z } from "zod";

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  fileUrl: z.string().url("Valid file URL is required"),
  fileSize: z.number().optional(),
  fileType: z.string().default("PDF"),
  category: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  isFree: z.boolean().default(true),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
