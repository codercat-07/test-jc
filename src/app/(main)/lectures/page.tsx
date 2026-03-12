import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight, PlayCircle, Layers } from "lucide-react";

export default async function LecturesPage() {
  const modules = await prisma.lectureModule.findMany({
    include: {
      _count: {
        select: { lectures: true }
      }
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="space-y-4 mb-16 text-center lg:text-left">
         <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-2">একাডেমিক লেকচার ও নোটস</Badge>
         <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Learning Modules
         </h1>
         <p className="text-muted-foreground text-xl max-w-2xl">
            Structured course content designed for deep understanding. Access video lectures, detailed notes, and related MCQs.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {modules.map((module: any) => (
           <Card key={module.id} className="glass-card border-none card-shadow group hover:bg-surface-elevated/50 transition-all duration-300">
              <CardContent className="p-8">
                 <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                    {module.type === "LECTURE" ? <PlayCircle className="h-8 w-8" /> : <Layers className="h-8 w-8" />}
                 </div>

                 <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                    {module.title}
                 </h2>
                 <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                    {module.description || "Comprehensive guide covers essential concepts, theories and practical examples for this module."}
                 </p>

                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                       <BookOpen className="h-3.5 w-3.5" />
                       {module._count.lectures} Lectures
                    </div>
                    <Button variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-white transition-all pr-2" asChild>
                       <Link href={`/lectures/${module.slug}`}>
                          Explore Module <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {modules.length === 0 && (
        <div className="py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
           <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
              <GraduationCap className="h-10 w-10" />
           </div>
           <p className="text-muted-foreground font-medium">No lecture modules established yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
