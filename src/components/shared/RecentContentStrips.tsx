import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, FileText, Briefcase, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RecentContentStrips() {
  const [recentMcqs, recentNotices, recentBlogs] = await Promise.all([
    prisma.mCQ.findMany({
      where: { status: "PUBLISHED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { subject: true },
    }),
    prisma.jobNotice.findMany({
      take: 4,
      orderBy: { publishedAt: "desc" },
      include: { organization: true },
    }),
    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="py-12 px-4 space-y-16">
      <div className="container mx-auto">
        
        {/* Recent MCQs Strip */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" /> সাম্প্রতিক MCQ
            </h2>
            <Link href="/mcq" className="text-primary text-sm font-semibold flex items-center group">
              See All <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMcqs.length > 0 ? recentMcqs.map((mcq) => (
              <Card key={mcq.id} className="glass-card hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{mcq.subject?.nameBn || "অন্যান্য"}</Badge>
                  <p className="line-clamp-2 text-sm font-medium mb-3">{(mcq.questionPlain as string)}</p>
                  <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                    <span>{mcq.uid}</span>
                    <Link href={`/mcq/${mcq.uid}`} className="text-primary hover:underline">View</Link>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-muted-foreground text-sm col-span-full">কোনো সাম্প্রতিক MCQ পাওয়া যায়নি।</p>
            )}
          </div>
        </div>

        {/* New Job Notices Strip */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-indigo-500" /> নতুন নিয়োগ বিজ্ঞপ্তি
            </h2>
            <Link href="/job-notices" className="text-primary text-sm font-semibold flex items-center group">
              See All <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentNotices.length > 0 ? recentNotices.map((notice) => (
              <Card key={notice.id} className="glass-card flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  {notice.organization.nameBn.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{notice.title}</h4>
                  <p className="text-sm text-muted-foreground">{notice.organization.nameBn}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/job-notices`}>সংবাদ</Link>
                </Button>
              </Card>
            )) : (
              <p className="text-muted-foreground text-sm col-span-full">কোনো সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি নেই।</p>
            )}
          </div>
        </div>

        {/* Recent Blogs Strip */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-pink-500" /> সাম্প্রতিক ব্লগ
            </h2>
            <Link href="/blog" className="text-primary text-sm font-semibold flex items-center group">
              See All <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBlogs.length > 0 ? recentBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group space-y-3">
                <div className="aspect-video rounded-2xl bg-muted overflow-hidden relative">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
                       <FileText className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">{blog.title}</h4>
              </Link>
            )) : (
              <p className="text-muted-foreground text-sm col-span-full">এখনো কোনো ব্লগ পোস্ট করা হয়নি।</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
