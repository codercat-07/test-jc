import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Search, Filter, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function JobSolutionPage({ searchParams }: { searchParams: Promise<{ orgId?: string; q?: string }> }) {
  const { orgId, q } = await searchParams;

  const where: any = {
    status: "PUBLISHED",
    organizationId: { not: null }, // Only items linked to an organization (job solutions)
  };

  if (orgId) where.organizationId = orgId;
  if (q) {
    where.OR = [
      { questionPlain: { contains: q, mode: "insensitive" } },
      { examHeading: { contains: q, mode: "insensitive" } },
    ];
  }

  const [mcqs, organizations] = await Promise.all([
    prisma.mCQ.findMany({
      where,
      include: {
        organization: true,
        subject: true,
      },
      orderBy: { examDate: "desc" },
      take: 50,
    }),
    prisma.organization.findMany({
       where: { mcqs: { some: {} } },
       orderBy: { nameBn: "asc" }
    })
  ]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-3">বিগত সালের প্রশ্নের সমাধান</Badge>
           <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
              <Briefcase className="h-10 w-10 text-primary" /> Job Solutions
           </h1>
           <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
              Solved questions from previous recruitment exams of various organizations. A must-have resource for authentic preparation.
           </p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by exam or topic..." className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" />
           </div>
           <Button className="rounded-full px-8 h-12 shadow-lg">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block space-y-8">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                 <Filter className="h-4 w-4" /> organizations
              </h3>
              <div className="space-y-1">
                 {organizations.map(org => (
                    <Link 
                      key={org.id} 
                      href={`/job-solution?orgId=${org.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all hover:bg-primary/10 ${orgId === org.id ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                       {org.nameBn}
                    </Link>
                 ))}
              </div>
           </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
           {mcqs.map((mcq) => (
             <Card key={mcq.id} className="glass-card border-none card-shadow group hover:bg-surface-elevated/50 transition-all duration-300">
                <CardContent className="p-6">
                   <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-primary/5 text-primary border-none text-[10px] uppercase font-bold">
                         {mcq.organization?.nameBn}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                         {mcq.examHeading}
                      </span>
                   </div>

                   <div className="prose prose-sm dark:prose-invert max-w-none text-foreground font-medium mb-6">
                      <p>{mcq.questionPlain}</p>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                         <GraduationCap className="h-3.5 w-3.5 opacity-50" />
                         {mcq.subject?.nameBn}
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 text-primary group" asChild>
                         <Link href={`/mcq/${mcq.uid}`}>
                            Full Solution <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                         </Link>
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}

           {mcqs.length === 0 && (
             <div className="py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
                <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                   <Filter className="h-10 w-10" />
                </div>
                <p className="text-muted-foreground font-medium">No job solutions found for your search.</p>
                <Button variant="link" asChild><Link href="/job-solution">Clear all filters</Link></Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
