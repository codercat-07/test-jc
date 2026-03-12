import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface McqPageProps {
  searchParams: Promise<{
    subjectId?: string;
    topicId?: string;
    orgId?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function McqBankPage({ searchParams }: McqPageProps) {
  const { subjectId, topicId, orgId, q, page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 20;

  const where: any = {
    status: "PUBLISHED",
  };

  if (subjectId) where.subjectId = subjectId;
  if (topicId) where.topicId = topicId;
  if (orgId) where.organizationId = orgId;
  if (q) {
    where.OR = [
      { questionPlain: { contains: q, mode: "insensitive" } },
      { uid: { contains: q, mode: "insensitive" } },
    ];
  }

  const [mcqs, total, subjects] = await Promise.all([
    prisma.mCQ.findMany({
      where,
      include: {
        subject: true,
        topic: true,
        organization: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.mCQ.count({ where }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" /> MCQ Bank
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse {total} MCQs from previous exams and special collections.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by question or UID..." 
              className="pl-9 bg-surface/50 rounded-full border-none shadow-sm focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Subjects</h3>
            <div className="flex flex-col gap-1">
              {subjects.map((sub) => (
                <Link
                   key={sub.id}
                   href={`/mcq?subjectId=${sub.id}`}
                   className={`px-3 py-2 rounded-lg text-sm transition-all hover:bg-primary/10 ${subjectId === sub.id ? 'bg-primary/20 text-primary font-bold' : ''}`}
                >
                  {sub.nameBn}
                </Link>
              ))}
              <Link 
                href="/mcq"
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"
              >
                Clear Filters
              </Link>
            </div>
          </div>
        </aside>

        {/* MCQ List */}
        <div className="lg:col-span-3 space-y-6">
          <Suspense fallback={<McqListSkeleton />}>
            <div className="grid gap-6">
              {mcqs.map((mcq) => (
                <Card key={mcq.id} className="glass-card border-none card-shadow overflow-hidden group hover:bg-surface-elevated/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {mcq.uid}
                      </Badge>
                      {mcq.subject && (
                        <Badge variant="outline" className="border-muted-foreground/20">
                          {mcq.subject.nameBn}
                        </Badge>
                      )}
                      {mcq.organization && (
                        <Badge variant="outline" className="border-muted-foreground/20 bg-muted/50">
                          {mcq.organization.nameBn}
                        </Badge>
                      )}
                      {mcq.examHeading && (
                        <span className="text-[12px] text-muted-foreground italic ml-auto">
                          {mcq.examHeading}
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      <ContentRenderer content={mcq.question} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(mcq.options as any[]).map((opt, i) => (
                        <div 
                          key={opt.id} 
                          className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border group-hover:border-primary/10 transition-all"
                        >
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-sm font-medium">{opt.textPlain}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/mcq/${mcq.uid}`}>
                          View Details & Explanation
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Save for later
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {mcqs.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                   <p className="text-muted-foreground">No MCQs found matching your filters.</p>
                   <Button variant="link" asChild><Link href="/mcq">Clear all filters</Link></Button>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function McqListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
