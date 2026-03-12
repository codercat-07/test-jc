import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { resourceSchema } from "@/lib/validations/resource";
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

    const [total, resources] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return successResponse(resources, {
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
    const validatedData = resourceSchema.parse(body);

    const resource = await prisma.resource.create({
      data: validatedData,
    });

    return successResponse(resource);
  } catch (error) {
    return errorResponse(error);
  }
}
