import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";
import { mcqSchema } from "@/lib/validations/mcq";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const importSchema = z.array(z.object({
  questionPlain: z.string(),
  options: z.array(z.object({
    textPlain: z.string(),
    isCorrect: z.boolean()
  })),
  explanationPlain: z.string().optional(),
  subjectName: z.string().optional(),
  topicName: z.string().optional(),
  organizationName: z.string().optional(),
  examHeading: z.string().optional(),
}));

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();
    const validatedData = importSchema.parse(body);

    // Get current count for UID generation
    const currentCount = await prisma.mCQ.count();
    
    // Process in a transaction or sequential to ensure UIDs
    const results = await prisma.$transaction(async (tx: any) => {
      const createdMcqs = [];
      
      for (let i = 0; i < validatedData.length; i++) {
        const item = validatedData[i];
        const uid = `MCQ-${(currentCount + i + 1).toString().padStart(5, "0")}`;
        
        // Find subject/topic/org by name or create placeholders
        // (Simplified for now - strictly by ID is better, but names are easier for CSV)
        let subjectId = null;
        if (item.subjectName) {
          const sub = await tx.subject.findFirst({ where: { nameBn: item.subjectName } });
          subjectId = sub?.id || null;
        }

        const mcq = await tx.mCQ.create({
          data: {
            uid,
            question: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: item.questionPlain }] }] },
            questionPlain: item.questionPlain,
            options: item.options.map(opt => ({
              id: Math.random().toString(36).substring(7),
              text: null,
              textPlain: opt.textPlain,
              isCorrect: opt.isCorrect
            })),
            explanation: item.explanationPlain ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: item.explanationPlain }] }] } : null,
            subjectId,
            examHeading: item.examHeading,
            status: "DRAFT", // Default to draft for safety
            createdBy: user.clerkId,
          },
        });
        createdMcqs.push(mcq);
      }
      return createdMcqs;
    });

    return successResponse({ count: results.length, message: "Import successful" });
  } catch (error) {
    return errorResponse(error);
  }
}
