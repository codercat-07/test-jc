import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.any().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;
