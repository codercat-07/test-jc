import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const subjects = await prisma.subject.findMany({
      orderBy: { order: "asc" },
    });
    return successResponse(subjects);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const subject = await prisma.subject.create({
      data: {
        name: body.name,
        nameBn: body.nameBn,
        slug: body.slug,
        order: body.order || 0,
      },
    });
    return successResponse(subject);
  } catch (error) {
    return errorResponse(error);
  }
}
