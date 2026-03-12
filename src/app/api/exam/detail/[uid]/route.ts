import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;

    const exam = await prisma.exam.findUnique({
      where: { uid },
      include: {
        sections: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (!exam) {
      return errorResponse("Exam not found", 404);
    }

    // Now gather all MCQ UIDs from all sections
    const allUids = Array.from(new Set(exam.sections.flatMap(s => s.mcqUids)));

    // Fetch the actual MCQ data
    const mcqs = await prisma.mCQ.findMany({
      where: { uid: { in: allUids } },
      select: {
        id: true,
        uid: true,
        question: true,
        options: true,
        // We don't include explanation here to prevent cheating!
      }
    });

    // Map MCQs back to sections for the frontend
    const mcqMap = new Map(mcqs.map(m => [m.uid, m]));
    
    const structuredSections = exam.sections.map(section => ({
      ...section,
      mcqItems: section.mcqUids.map(uid => mcqMap.get(uid)).filter(Boolean)
    }));

    return successResponse({
      ...exam,
      sections: structuredSections
    });
  } catch (error) {
    return errorResponse(error);
  }
}
