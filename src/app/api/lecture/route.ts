import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { lectureSchema } from "@/lib/validations/lecture";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const subjectId = searchParams.get("subjectId");
    const topicId = searchParams.get("topicId");
    const query = searchParams.get("q");

    const where: any = {
      status: "PUBLISHED",
    };

    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
      ];
    }

    const [total, lectures] = await Promise.all([
      prisma.lecture.count({ where }),
      prisma.lecture.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { nameBn: true } },
          topic: { select: { nameBn: true } },
        },
      }),
    ]);

    return successResponse(lectures, {
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

    const validatedData = lectureSchema.parse(body);

    const lecture = await prisma.lecture.create({
      data: {
        ...validatedData,
        createdBy: user.clerkId,
      },
    });

    return successResponse(lecture);
  } catch (error) {
    return errorResponse(error);
  }
}
