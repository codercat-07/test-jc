import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Info, Share2, Bookmark } from "lucide-react";

interface McqDetailProps {
  params: Promise<{ uid: string }>;
}

export default async function McqDetailPage({ params }: McqDetailProps) {
  const { uid } = await params;

  const mcq = await prisma.mCQ.findUnique({
    where: { uid },
    include: {
      subject: true,
      topic: true,
      organization: true,
    },
  });

  if (!mcq || mcq.status !== "PUBLISHED") {
    notFound();
  }

  const options = mcq.options as any[];
  const correctOption = options.find(o => o.isCorrect);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/mcq" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Bank
        </Link>
      </Button>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-md py-1 px-3">
                {mcq.uid}
              </Badge>
              {mcq.subject && <Badge variant="outline">{mcq.subject.nameBn}</Badge>}
              <span className="text-muted-foreground text-sm flex items-center gap-2 ml-2">
                <Info className="h-4 w-4" /> {mcq.viewCount} views
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Question Details
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full shadow-sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="glass-card border-none card-shadow overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ContentRenderer content={mcq.question} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <div 
                  key={opt.id} 
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    opt.isCorrect 
                    ? "bg-success/5 border-success/30 ring-2 ring-success/10" 
                    : "bg-surface-elevated border-border"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    opt.isCorrect ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-lg">{opt.textPlain}</span>
                  </div>
                  {opt.isCorrect && <CheckCircle2 className="h-6 w-6 text-success" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {mcq.explanation && (
          <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/10 py-3 border-b border-primary/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5" /> সঠিক উত্তর ও ব্যাখ্যা
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="prose dark:prose-invert max-w-none">
                  <ContentRenderer content={mcq.explanation} />
               </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center py-6 border-y border-border/50">
           <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-muted-foreground">Source Info</p>
              <p className="font-medium">{mcq.organization?.nameBn || "Standard Question"}{mcq.examHeading ? ` — ${mcq.examHeading}` : ""}</p>
           </div>
           
           <div className="flex gap-4">
              {/* Future: Previous/Next MCQ buttons based on subject filter */}
           </div>
        </div>
      </div>
    </div>
  );
}
