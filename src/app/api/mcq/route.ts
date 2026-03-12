import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { mcqSchema } from "@/lib/validations/mcq";
import { requireAdmin } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const subjectId = searchParams.get("subjectId");
    const topicId = searchParams.get("topicId");
    const organizationId = searchParams.get("organizationId");
    const query = searchParams.get("q");

    const where: any = {
      status: "PUBLISHED",
    };

    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (organizationId) where.organizationId = organizationId;
    if (query) {
      where.OR = [
        { questionPlain: { contains: query, mode: "insensitive" } },
        { uid: { contains: query, mode: "insensitive" } },
      ];
    }

    const [total, mcqs] = await Promise.all([
      prisma.mCQ.count({ where }),
      prisma.mCQ.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          subject: { select: { nameBn: true, name: true } },
          topic: { select: { nameBn: true, name: true } },
          organization: { select: { nameBn: true, name: true } },
        },
      }),
    ]);

    return successResponse(mcqs, {
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
    
    // Parse date if it exists
    if (body.examDate) {
      body.examDate = new Date(body.examDate);
    }

    const validatedData = mcqSchema.parse(body);

    // Generate UID: MCQ-XXXXX
    const count = await prisma.mCQ.count();
    const uid = `MCQ-${(count + 1).toString().padStart(5, "0")}`;

    const mcq = await prisma.mCQ.create({
      data: {
        ...validatedData,
        uid,
        createdBy: user.clerkId,
      },
    });

    return successResponse(mcq);
  } catch (error) {
    return errorResponse(error);
  }
}
