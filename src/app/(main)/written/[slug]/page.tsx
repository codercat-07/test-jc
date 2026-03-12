import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  Lightbulb, 
  Share2 
} from "lucide-react";
import { format } from "date-fns";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exam = await prisma.writtenExam.findUnique({ where: { slug } });
  
  if (!exam) return { title: "Written Exam Not Found" };

  return {
    title: `${exam.title} - Written Exam Solution`,
    description: `Detailed question and model solution for ${exam.title}. Prepare for your competitive exams with BD-LMS.`,
  };
}

export default async function WrittenExamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const exam = await prisma.writtenExam.findUnique({
    where: { slug },
    include: {
      subject: true,
    },
  });

  if (!exam || exam.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Button variant="ghost" asChild className="mb-12 hover:bg-primary/5 hover:text-primary transition-colors">
        <Link href="/written" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Written Hub
        </Link>
      </Button>

      <article className="space-y-12">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-4 py-1 uppercase font-bold text-[10px]">
              {exam.subject?.nameBn || "অন্যান্য"}
            </Badge>
            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none px-4 py-1 uppercase font-bold text-[10px]">
              Descriptive Question
            </Badge>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {exam.title}
          </h1>

          <div className="flex items-center gap-6 py-4 text-muted-foreground text-sm border-y border-border/50">
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Posted on {format(exam.createdAt, "PPP")}
             </div>
             <div className="flex items-center gap-2">
                <User className="h-4 w-4" /> Verified Academic Content
             </div>
          </div>
        </header>

        {/* Question Area */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 text-primary">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                 <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest">Question Body</h2>
           </div>
           
           <Card className="glass-card border-none card-shadow-xl overflow-hidden bg-surface-elevated/40">
              <CardContent className="p-8 lg:p-10">
                 <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-2xl">
                    <ContentRenderer content={exam.content} />
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Answer Area */}
        {exam.solution && (
          <section className="space-y-6 pt-8 border-t border-border/50">
             <div className="flex items-center gap-3 text-success">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                   <CheckCircle className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest">Sample Solution</h2>
             </div>

             <Card className="glass-card border-none card-shadow-xl overflow-hidden border-l-4 border-l-success">
                <CardContent className="p-8 lg:p-10 bg-success/[0.02]">
                   <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-2xl">
                      <ContentRenderer content={exam.solution} />
                   </div>
                </CardContent>
             </Card>

             <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-4 items-start">
                <Lightbulb className="h-6 w-6 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-700 dark:text-amber-400">Study Tip</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-500 leading-relaxed">
                    Try to answer the question yourself first without looking at the sample solution. This helps in retaining the structure and key points better.
                  </p>
                </div>
             </div>
          </section>
        )}

        <footer className="pt-12 text-center">
           <Button size="lg" className="rounded-full px-12 gap-2 shadow-xl hover:shadow-primary/20 transition-all">
              <Share2 className="h-5 w-5" /> Share this Question
           </Button>
        </footer>
      </article>
    </div>
  );
}
