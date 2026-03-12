import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    await requireAdmin();
    
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;

    const topics = await prisma.topic.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return successResponse(topics);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const topic = await prisma.topic.create({
      data: {
        name: body.name,
        nameBn: body.nameBn,
        slug: body.slug,
        subjectId: body.subjectId,
        order: body.order || 0,
      },
    });
    return successResponse(topic);
  } catch (error) {
    return errorResponse(error);
  }
}
