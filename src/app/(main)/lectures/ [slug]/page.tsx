import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen, Share2, Bookmark } from "lucide-react";
import { format } from "date-fns";

export default async function LectureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const lecture = await prisma.lecture.findUnique({
    where: { slug },
    include: {
      subject: true,
      topic: true,
    },
  });

  if (!lecture || lecture.status !== "PUBLISHED") {
    notFound();
  }

  // Simple logic to extract YouTube ID for embed
  const getYoutubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(lecture.videoUrl);

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <Button variant="ghost" asChild className="mb-8 hover:bg-primary/5 hover:text-primary transition-colors">
        <Link href="/lectures" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Lectures
        </Link>
      </Button>

      <article className="space-y-10">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3">
              {lecture.subject?.nameBn || "অন্যান্য"}
            </Badge>
            {lecture.topic && <Badge variant="outline">{lecture.topic.nameBn}</Badge>}
            <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-none">
              Lesson
            </Badge>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lecture.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border/50 text-muted-foreground text-sm">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <Calendar className="h-4 w-4" /> {format(lecture.createdAt, "PPP")}
                </div>
                <div className="flex items-center gap-2">
                   <BookOpen className="h-4 w-4" /> {lecture.viewCount} Views
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-full"><Bookmark className="h-4 w-4" /></Button>
             </div>
          </div>
        </header>

        {embedUrl && (
          <div className="aspect-video w-full rounded-[32px] overflow-hidden border border-border shadow-2xl bg-muted">
            <iframe 
              src={embedUrl} 
              className="w-full h-full" 
              allowFullScreen 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
           <Card className="glass-card border-none card-shadow-xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                 <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:font-black prose-a:text-primary">
                    <ContentRenderer content={lecture.content} />
                 </div>
              </CardContent>
           </Card>
        </div>

        <footer className="pt-12 border-t border-border/50">
           <div className="bg-muted/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                 <h3 className="text-2xl font-bold">Did you find this lesson helpful?</h3>
                 <p className="text-muted-foreground">Share your thoughts or bookmark it for later review.</p>
              </div>
              <div className="flex gap-4">
                 <Button size="lg" className="rounded-full px-8">Complete Lesson</Button>
                 <Button variant="outline" size="lg" className="rounded-full px-8">Next Topic</Button>
              </div>
           </div>
        </footer>
      </article>
    </div>
  );
}
