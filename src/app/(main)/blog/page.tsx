import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, PenTool, Hash, ArrowUpRight, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default async function BlogListingPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const { category, tag } = await searchParams;

  const where: any = {
    status: "PUBLISHED",
  };

  if (category) where.category = category;
  if (tag) where.tags = { has: tag };

  const blogs = await prisma.blog.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-2">ব্লগ ও প্রবন্ধ</Badge>
           <h1 className="text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Educational Insights
           </h1>
           <p className="text-muted-foreground text-lg max-w-xl">
              Deep dives into exam strategies, career guidance, and academic analysis from our experts.
           </p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" />
           </div>
           <Button className="rounded-full px-8 h-12">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {blogs.map((post) => (
           <Card key={post.id} className="glass-card border-none card-shadow group overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500">
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-muted">
                 {post.coverImage ? (
                   <img 
                     src={post.coverImage} 
                     alt={post.title} 
                     className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center opacity-10">
                      <PenTool className="h-20 w-20" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <Badge className="bg-primary/95 text-white border-none backdrop-blur-md">
                       {post.category || "General"}
                    </Badge>
                 </div>
              </div>

              <CardContent className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(post.createdAt, "MMM d, yyyy")}</div>
                    <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> Staff Editor</div>
                 </div>

                 <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                 </h2>

                 <p className="text-muted-foreground text-sm line-clamp-3 mb-8 leading-relaxed">
                    {post.description}
                 </p>

                 <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex gap-1">
                       {post.tags.slice(0, 2).map(t => (
                         <div key={t} className="text-[10px] font-black text-muted-foreground/50 uppercase flex items-center gap-1">
                            <Hash className="h-2 w-2" /> {t}
                         </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-primary hover:bg-primary/10 transition-colors" asChild>
                       <Link href={`/blog/${post.slug}`}>
                          <ArrowUpRight className="h-5 w-5" />
                       </Link>
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {blogs.length === 0 && (
        <div className="py-24 text-center space-y-4">
           <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
              <PenTool className="h-10 w-10" />
           </div>
           <p className="text-muted-foreground font-medium">No blog posts found yet.</p>
        </div>
      )}
    </div>
  );
}
