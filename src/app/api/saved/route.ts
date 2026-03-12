import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api";
import { getCurrentDbUser as requireUser } from "@/lib/auth";
import { z } from "zod";

const savedSchema = z.object({
  itemType: z.enum(["MCQ", "LECTURE", "BLOG", "CURRENT_AFFAIR", "WRITTEN"]),
  itemId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { itemType, itemId } = savedSchema.parse(body);

    const saved = await prisma.savedItem.upsert({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType,
          itemId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        itemType,
        itemId,
      },
    });

    return successResponse(saved);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType") as any;
    const itemId = searchParams.get("itemId");

    if (!itemType || !itemId) throw new Error("Missing params");

    await prisma.savedItem.delete({
      where: {
        userId_itemType_itemId: {
          userId: user.id,
          itemType,
          itemId,
        },
      },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const saved = await prisma.savedItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(saved);
  } catch (error) {
    return errorResponse(error);
  }
}
