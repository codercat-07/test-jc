import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { writtenExamSchema } from "@/lib/validations/written";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const subjectId = searchParams.get("subjectId");
    const query = searchParams.get("q");

    const where: any = {
      status: "PUBLISHED",
    };

    if (subjectId) where.subjectId = subjectId;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
      ];
    }

    const [total, writtenExams] = await Promise.all([
      prisma.writtenExam.count({ where }),
      prisma.writtenExam.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { nameBn: true } },
        },
      }),
    ]);

    return successResponse(writtenExams, {
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

    const validatedData = writtenExamSchema.parse(body);

    const writtenExam = await prisma.writtenExam.create({
      data: {
        ...validatedData,
        createdBy: user.clerkId,
      },
    });

    return successResponse(writtenExam);
  } catch (error) {
    return errorResponse(error);
  }
}
