import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const organizations = await prisma.organization.findMany({
      orderBy: { name: "asc" },
    });
    return successResponse(organizations);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const org = await prisma.organization.create({
      data: {
        name: body.name,
        nameBn: body.nameBn,
        slug: body.slug,
        logo: body.logo,
      },
    });
    return successResponse(org);
  } catch (error) {
    return errorResponse(error);
  }
}
