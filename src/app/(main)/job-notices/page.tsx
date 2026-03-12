import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Calendar, ExternalLink, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default async function JobNoticesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const where: any = {};
  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }

  const notices = await prisma.jobNotice.findMany({
    where,
    include: {
      organization: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-3">সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি</Badge>
           <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
              <Briefcase className="h-10 w-10 text-primary" /> Job Notices
           </h1>
           <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
              Stay ahead with the latest government and private job circulars. Download official PDFs and find related preparation materials.
           </p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search circulars..." className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" />
           </div>
           <Button className="rounded-full px-8 h-12 shadow-lg">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {notices.map((notice: any) => (
           <Card key={notice.id} className="glass-card border-none card-shadow group hover:bg-surface-elevated/50 transition-all duration-300">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <FileText className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] uppercase font-bold">
                       {notice.organization.nameBn}
                    </Badge>
                 </div>

                 <h2 className="text-xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {notice.title}
                 </h2>

                 <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Calendar className="h-4 w-4 opacity-50" />
                       Published: {format(new Date(notice.publishedAt), "PPP")}
                    </div>
                    {notice.deadline && (
                       <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                          <Calendar className="h-4 w-4" />
                          Deadline: {format(new Date(notice.deadline), "PPP")}
                       </div>
                    )}
                 </div>

                 <div className="flex items-center gap-2 mt-auto">
                    {notice.pdfUrl && (
                       <Button variant="outline" size="sm" className="flex-1 rounded-full group-hover:border-primary/30 transition-all" asChild>
                          <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer">
                             Official PDF
                          </a>
                       </Button>
                    )}
                    {notice.sourceUrl && (
                       <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0 hover:bg-primary/10 text-primary" asChild>
                          <a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="h-4 w-4" />
                          </a>
                       </Button>
                    )}
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {notices.length === 0 && (
        <div className="py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
           <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
              <Briefcase className="h-10 w-10" />
           </div>
           <p className="text-muted-foreground font-medium">No job notices available at the moment.</p>
        </div>
      )}
    </div>
  );
}
