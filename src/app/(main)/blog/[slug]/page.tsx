import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2, Bookmark, MessageCircle, Hash } from "lucide-react";
import { format } from "date-fns";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  
  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: `${post.title} | BD-LMS Blog`,
    description: post.description || `Read ${post.title} on BD-LMS.`,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Button variant="ghost" asChild className="mb-12 hover:bg-primary/5 hover:text-primary transition-colors">
        <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      <article className="space-y-12">
        <header className="space-y-8 text-center">
          <div className="flex justify-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-4 py-1 uppercase font-bold tracking-widest text-[10px]">
              {post.category || "General"}
            </Badge>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-border/50 text-muted-foreground text-sm">
             <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">BD</div>
                <span className="font-bold">Staff Author</span>
             </div>
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {format(post.createdAt, "MMMM d, yyyy")}
             </div>
             <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> 0 Comments
             </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-[21/9] w-full rounded-[48px] overflow-hidden border border-border shadow-2xl relative">
            <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full" />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
           <div className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none prose-img:rounded-3xl prose-headings:font-black prose-a:text-primary prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl">
              <ContentRenderer content={post.content} />
           </div>

           <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="rounded-full px-4 py-1 hover:bg-primary/5 transition-colors cursor-pointer">
                   <Hash className="h-3 w-3 mr-1 text-primary/50" /> {tag}
                </Badge>
              ))}
           </div>
        </div>

        <footer className="pt-16 pb-12">
           <Card className="bg-muted/10 border-none rounded-[48px] p-10 text-center space-y-8">
              <h3 className="text-3xl font-bold">Share your thoughts</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Found this article useful? Share it with your fellow candidates or bookmark it for future reference.
              </p>
              <div className="flex justify-center gap-4">
                 <Button size="lg" className="rounded-full px-10 gap-2">
                    <Share2 className="h-5 w-5" /> Share Article
                 </Button>
                 <Button variant="outline" size="lg" className="rounded-full px-10 gap-2">
                    <Bookmark className="h-5 w-5" /> Bookmark
                 </Button>
              </div>
           </Card>
        </footer>
      </article>
    </div>
  );
}
