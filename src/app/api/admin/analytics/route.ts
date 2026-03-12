import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { subDays, startOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    
    // Get stats for last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30);

    const [userGrowth, attemptGrowth] = await Promise.all([
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.examAttempt.groupBy({
        by: ['submittedAt'],
        _count: { id: true },
        where: { submittedAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    // Format for charts (grouping by date)
    const formatData = (data: any[], dateKey: string) => {
      const map: any = {};
      data.forEach(item => {
        const date = startOfDay(new Date(item[dateKey])).toISOString();
        map[date] = (map[date] || 0) + item._count.id;
      });
      return Object.entries(map).map(([date, count]) => ({ date, count })).sort((a,b) => a.date.localeCompare(b.date));
    };

    return successResponse({
      userGrowth: formatData(userGrowth, 'createdAt'),
      attemptGrowth: formatData(attemptGrowth, 'submittedAt'),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
