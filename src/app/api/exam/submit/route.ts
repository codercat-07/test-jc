import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { examId, answers, timeSpent } = body;

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        sections: true
      }
    });

    if (!exam) return errorResponse("Exam not found", 404);

    // Get all MCQ UIDs for this exam
    const allUids = exam.sections.flatMap(s => s.mcqUids);
    const mcqs = await prisma.mCQ.findMany({
      where: { uid: { in: allUids } }
    });

    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    const resultDetails: any[] = [];

    mcqs.forEach(mcq => {
      const options = mcq.options as any[];
      const correctOption = options.find(o => o.isCorrect);
      const userOptionId = answers[mcq.uid];
      
      const isCorrect = userOptionId === correctOption?.id;
      const isWrong = userOptionId && userOptionId !== correctOption?.id;

      if (isCorrect) {
        totalMarks += exam.perCorrectMark;
        correctCount++;
      } else if (isWrong) {
        totalMarks -= exam.perWrongMark;
        wrongCount++;
      }

      resultDetails.push({
        mcqUid: mcq.uid,
        userOptionId,
        correctOptionId: correctOption?.id,
        isCorrect,
      });
    });

    // Create Attempt and Result in a transaction
    const attempt = await prisma.$transaction(async (tx) => {
      const newAttempt = await tx.examAttempt.create({
        data: {
          examId,
          userId,
          timeSpent,
          status: "COMPLETED",
          completedAt: new Date(),
        }
      });

      const newResult = await tx.examResult.create({
        data: {
          attemptId: newAttempt.id,
          totalMarks,
          correctCount,
          wrongCount,
          skippedCount: mcqs.length - (correctCount + wrongCount),
          answers: resultDetails,
        }
      });

      return newAttempt;
    });

    return successResponse({ id: attempt.id });
  } catch (error) {
    return errorResponse(error);
  }
}
