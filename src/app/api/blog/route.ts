import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, getPaginationParams } from "@/lib/api";
import { blogSchema } from "@/lib/validations/blog";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = getPaginationParams(searchParams);

    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const query = searchParams.get("q");

    const where: any = {
      status: "PUBLISHED",
    };

    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
      ];
    }

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return successResponse(blogs, {
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
    const validatedData = blogSchema.parse(body);

    const blog = await prisma.blog.create({
      data: {
        ...validatedData,
        authorId: user.clerkId,
      },
    });

    return successResponse(blog);
  } catch (error) {
    return errorResponse(error);
  }
}
