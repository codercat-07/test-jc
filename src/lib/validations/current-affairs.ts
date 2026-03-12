import { z } from "zod";

export const currentAffairsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  category: z.enum(["BANGLADESH", "INTERNATIONAL", "SPORTS", "ECONOMY", "SCIENCE", "OTHER"]).default("BANGLADESH"),
  content: z.any().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export type CurrentAffairsInput = z.infer<typeof currentAffairsSchema>;
