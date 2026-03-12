import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { currentAffairsSchema } from "@/lib/validations/current-affairs";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const category = searchParams.get("category");

    const where: any = {
      status: "PUBLISHED",
    };

    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (category) where.category = category;

    const [total, items] = await Promise.all([
      prisma.currentAffairs.count({ where }),
      prisma.currentAffairs.findMany({
        where,
        skip,
        take,
        orderBy: [{ year: "desc" }, { month: "desc" }],
      }),
    ]);

    return successResponse(items, {
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
    await requireAdmin();
    const body = await req.json();
    const validatedData = currentAffairsSchema.parse(body);

    const item = await prisma.currentAffairs.create({
      data: validatedData,
    });

    return successResponse(item);
  } catch (error) {
    return errorResponse(error);
  }
}
