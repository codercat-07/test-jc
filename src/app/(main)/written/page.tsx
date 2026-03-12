import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, PenLine, BookOpen, ArrowUpRight, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function WrittenExamListingPage({ searchParams }: { searchParams: Promise<{ subjectId?: string; q?: string }> }) {
  const { subjectId, q } = await searchParams;

  const where: any = {
    status: "PUBLISHED",
  };

  if (subjectId) where.subjectId = subjectId;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
    ];
  }

  const exams = await prisma.writtenExam.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      subject: { select: { nameBn: true } },
    },
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-2">লিখিত পরীক্ষা প্রস্তুতি</Badge>
           <h1 className="text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-foreground to-primary/60 bg-clip-text text-transparent">
              Written Exam Hub
           </h1>
           <p className="text-muted-foreground text-lg max-w-xl">
              Access curated descriptive questions and model answers to master your written exam preparation.
           </p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search and prepare..." className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" />
           </div>
           <Button className="rounded-full px-8 h-12 shadow-lg">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {exams.map((exam) => (
           <Card key={exam.id} className="glass-card border-none card-shadow group overflow-hidden hover:bg-surface-elevated/50 transition-all duration-300">
              <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <PenLine className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] uppercase font-bold">
                       {exam.subject?.nameBn || "General"}
                    </Badge>
                 </div>

                 <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {exam.title}
                 </h2>

                 <div className="flex items-center gap-6 mt-auto pt-8 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                       <BookOpen className="h-3.5 w-3.5 opacity-50" /> Solution Available
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                       <GraduationCap className="h-3.5 w-3.5 opacity-50" /> High Yield
                    </div>
                    <Button variant="ghost" className="ml-auto rounded-full h-10 w-10 p-0 text-primary hover:bg-primary/10 transition-colors" asChild>
                       <Link href={`/written/${exam.slug}`}>
                          <ArrowUpRight className="h-5 w-5" />
                       </Link>
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {exams.length === 0 && (
        <div className="py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
           <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
              <PenLine className="h-10 w-10" />
           </div>
           <p className="text-muted-foreground font-medium">No written exams found.</p>
        </div>
      )}
    </div>
  );
}
