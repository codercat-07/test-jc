"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogInput } from "@/lib/validations/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { 
  FileEdit, 
  Image as ImageIcon, 
  Tag, 
  Save, 
  ArrowLeft,
  Settings,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      content: null,
      status: "DRAFT",
      tags: [],
    },
  });

  const onSubmit = async (data: BlogInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Blog post");

      toast.success("Blog post created");
      router.push("/admin/blog");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>Article Content</CardTitle>
                 <CardDescription>Draft your blog post with rich text and media</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Post Title</Label>
                    <Input 
                      {...register("title")} 
                      placeholder="e.g. 10 Tips for BCS Preparation" 
                      className="text-lg font-bold h-12"
                      onChange={(e) => {
                        setValue("title", e.target.value);
                        setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                      }}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description / Excerpt</Label>
                    <Textarea 
                      {...register("description")} 
                      placeholder="A brief summary for cards and SEO..." 
                      className="resize-none h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Cover Image URL</Label>
                    <Input {...register("coverImage")} placeholder="https://..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Article Body</Label>
                    <RichTextEditor 
                      content={watch("content")}
                      onChange={(json) => setValue("content", json)}
                      placeholder="Start writing your story..."
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Post Metadata
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={(val) => setValue("category", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preparation">Preparation Tips</SelectItem>
                        <SelectItem value="news">Platform News</SelectItem>
                        <SelectItem value="career">Career Advice</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Tag className="h-3 w-3" /> Tags (Comma separated)</Label>
                    <Input 
                      placeholder="bcs, bank, motivation" 
                      onChange={(e) => setValue("tags", e.target.value.split(",").map(t => t.trim()))}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                     <Label>Publish Status</Label>
                     <Select onValueChange={(val: any) => setValue("status", val)} defaultValue="DRAFT">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
               <CardFooter className="p-6 border-t bg-muted/5 flex flex-col gap-3">
                  <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg">
                    {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Post</>}
                  </Button>
                   <Button variant="outline" type="button" className="w-full" asChild>
                    <Link href="/blog" target="_blank"><Eye className="mr-2 h-4 w-4" /> Preview Blog</Link>
                  </Button>
               </CardFooter>
             </Card>

             <Card className="glass-card border-none card-shadow mt-6">
                <CardHeader className="bg-muted/30 border-b py-3 px-6">
                   <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Advanced SEO</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-1">
                      <Label className="text-xs">SEO Title</Label>
                      <Input {...register("seoTitle")} className="h-8 text-xs" />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-xs">Meta Description</Label>
                      <Input {...register("seoDesc")} className="h-8 text-xs" />
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
