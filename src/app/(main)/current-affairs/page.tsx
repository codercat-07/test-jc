import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Newspaper, Calendar, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function CurrentAffairsPage({ searchParams }: { searchParams: Promise<{ month?: string; year?: string; category?: string }> }) {
  const { month, year, category } = await searchParams;

  const where: any = {};

  const items = await prisma.currentAffairs.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-3">মাসিক সাধারণ জ্ঞান</Badge>
           <h1 className="text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-4">
              <Newspaper className="h-10 w-10 text-primary" /> Current Affairs
           </h1>
           <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
              Stay updated with the latest happenings in Bangladesh and around the world, categorized and structured for your exam preparation.
           </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-9 bg-muted/30 border-none rounded-full" />
           </div>
           <Button variant="outline" size="icon" className="rounded-full"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-8">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                 <Calendar className="h-4 w-4" /> archive
              </h3>
              <div className="flex flex-wrap gap-2">
                 {[2025, 2024, 2023].map(y => (
                    <Button key={y} variant={year === y.toString() ? "default" : "outline"} size="sm" className="rounded-full px-4">
                       {y}
                    </Button>
                 ))}
              </div>
           </div>

           <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">Categories</h3>
              <div className="space-y-1">
                 {["BANGLADESH", "INTERNATIONAL", "SPORTS", "ECONOMY"].map(cat => (
                    <Button key={cat} variant="ghost" className="w-full justify-start text-sm capitalize hover:bg-primary/5 hover:text-primary transition-colors">
                       {cat.toLowerCase()}
                    </Button>
                 ))}
              </div>
           </div>
        </aside>

        {/* Timeline Content */}
        <div className="lg:col-span-3 space-y-12">
           {items.length > 0 ? (
             items.map((item: any, i: number) => (
               <div key={item.id} className="relative pl-12">
                  {/* Timeline Line */}
                  {i !== items.length - 1 && <div className="absolute left-[23px] top-10 bottom-[-48px] w-0.5 bg-border/50" />}
                  
                  {/* Dot */}
                  <div className="absolute left-0 top-1 h-12 w-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center z-10">
                     <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Badge className="bg-primary/5 text-primary border-none text-[10px] uppercase font-bold">
                           {format(new Date(item.publishedAt), "MMMM yyyy")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">
                           {item.category}
                        </Badge>
                     </div>

                     <Card className="glass-card border-none card-shadow-xl group hover:bg-surface-elevated/50 transition-all duration-300">
                        <CardContent className="p-8 space-y-6">
                           <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                              {item.title}
                           </h2>
                           <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                              <ContentRenderer content={item.content} />
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
             ))
           ) : (
             <div className="py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
                <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                   <Filter className="h-10 w-10" />
                </div>
                <p className="text-muted-foreground font-medium">No records found for the selected criteria.</p>
                <Button variant="link">Clear all filters</Button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
