import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { examSchema } from "@/lib/validations/exam";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const isLive = searchParams.get("isLive") === "true";
    
    const where: any = {
      status: "PUBLISHED",
    };

    if (isLive) where.isLive = true;

    const [total, exams] = await Promise.all([
      prisma.exam.count({ where }),
      prisma.exam.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { attempts: true } },
          organization: { select: { nameBn: true } },
        },
      }),
    ]);

    return successResponse(exams, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await req.json();

    const validatedData = examSchema.parse(body);

    // Generate UID: EXM-XXXXX
    const count = await prisma.exam.count();
    const uid = `EXM-${(count + 1).toString().padStart(5, "0")}`;

    const exam = await prisma.$transaction(async (tx: any) => {
      const { sections, ...examData } = validatedData;
      
      const newExam = await tx.exam.create({
        data: {
          ...examData,
          uid,
          createdBy: user.clerkId,
        },
      });

      // Create sections
      for (const section of sections) {
        await tx.examSectionItem.create({
          data: {
            examId: newExam.id,
            sectionId: section.sectionId,
            mcqUids: section.mcqUids,
            order: section.order,
          },
        });
      }

      return newExam;
    });

    return successResponse(exam);
  } catch (error) {
    return errorResponse(error);
  }
}
