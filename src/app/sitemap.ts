import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bd-lms.com';

  // Fetch all dynamic slugs
  const [blogs, exams, lectures, writtenExams] = await Promise.all([
    prisma.blog.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.exam.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, createdAt: true } }),
    prisma.lecture.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.writtenExam.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, createdAt: true } }),
  ]);

  const blogEntries = blogs.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const examEntries = exams.map((exam: any) => ({
    url: `${baseUrl}/exam/${exam.id}`,
    lastModified: exam.createdAt,
  }));

  const lectureEntries = lectures.map((lecture: any) => ({
    url: `${baseUrl}/lectures/${lecture.slug}`,
    lastModified: lecture.updatedAt,
  }));

  const writtenEntries = writtenExams.map((written: any) => ({
    url: `${baseUrl}/written/${written.slug}`,
    lastModified: written.createdAt,
  }));

  const staticPages = [
    '',
    '/mcq',
    '/exams',
    '/lectures',
    '/blog',
    '/current-affairs',
    '/written',
    '/data-vault',
    '/job-notices',
  ].map((route: any) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...blogEntries, ...examEntries, ...lectureEntries, ...writtenEntries];
}
