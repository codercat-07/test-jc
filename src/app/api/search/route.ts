import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return successResponse([]);
    }

    // Parallel searches across models
    const [mcqs, blogs, exams, lectures, writtenExams] = await Promise.all([
      prisma.mcq.findMany({
        where: { questionPlain: { contains: query, mode: "insensitive" }, status: "PUBLISHED" },
        take: 5,
        select: { id: true, uid: true, questionPlain: true },
      }),
      prisma.blog.findMany({
        where: { title: { contains: query, mode: "insensitive" }, status: "PUBLISHED" },
        take: 3,
        select: { id: true, title: true, slug: true },
      }),
      prisma.exam.findMany({
        where: { title: { contains: query, mode: "insensitive" }, status: "PUBLISHED" },
        take: 3,
        select: { id: true, title: true, slug: true },
      }),
      prisma.lecture.findMany({
        where: { title: { contains: query, mode: "insensitive" }, status: "PUBLISHED" },
        take: 3,
        select: { id: true, title: true, slug: true },
      }),
      prisma.writtenExam.findMany({
        where: { title: { contains: query, mode: "insensitive" }, status: "PUBLISHED" },
        take: 3,
        select: { id: true, title: true, slug: true },
      }),
    ]);

    // Unified result format
    const results = [
      ...mcqs.map(m => ({ id: m.id, title: m.questionPlain, type: "MCQ", url: `/mcq/${m.uid}` })),
      ...blogs.map(b => ({ id: b.id, title: b.title, type: "Blog", url: `/blog/${b.slug}` })),
      ...exams.map(e => ({ id: e.id, title: e.title, type: "Exam", url: `/exam/${e.id}` })),
      ...lectures.map(l => ({ id: l.id, title: l.title, type: "Lecture", url: `/lectures/${l.slug}` })),
      ...writtenExams.map(w => ({ id: w.id, title: w.title, type: "Written", url: `/written/${w.slug}` })),
    ];

    return successResponse(results);
  } catch (error) {
    return errorResponse(error);
  }
}
