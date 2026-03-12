import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { jobNoticeSchema } from "@/lib/validations/job";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const where: any = {
      status: "PUBLISHED",
    };

    if (category) where.category = category;
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
      ];
    }

    const [total, notices] = await Promise.all([
      prisma.jobNotice.count({ where }),
      prisma.jobNotice.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: "desc" },
        include: {
          organization: { select: { nameBn: true, name: true, logo: true } },
        },
      }),
    ]);

    return successResponse(notices, {
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

    const validatedData = jobNoticeSchema.parse(body);

    const notice = await prisma.jobNotice.create({
      data: {
        ...validatedData,
      },
    });

    return successResponse(notice);
  } catch (error) {
    return errorResponse(error);
  }
}
