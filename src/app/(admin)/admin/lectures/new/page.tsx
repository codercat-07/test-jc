"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lectureSchema, LectureInput } from "@/lib/validations/lecture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { 
  Video, 
  FileText, 
  Save, 
  ArrowLeft, 
  Globe, 
  Lock,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function AdminNewLecturePage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LectureInput>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      content: null,
      isFree: false,
      status: "DRAFT",
    },
  });

  const selectedSubjectId = watch("subjectId");

  useEffect(() => {
    fetch("/api/admin/subjects").then(res => res.json()).then(data => setSubjects(data));
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      fetch(`/api/admin/topics?subjectId=${selectedSubjectId}`)
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(() => setTopics([]));
    } else {
      setTopics([]);
    }
  }, [selectedSubjectId]);

  const onSubmit = async (data: LectureInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Lecture");

      toast.success("Lecture published successfully");
      router.push("/admin/lectures");
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
          <Link href="/admin/lectures"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Lecture</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>Content Body</CardTitle>
                 <CardDescription>Write your educational content using the rich text editor</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Lecture Title</Label>
                    <Input 
                      {...register("title")} 
                      placeholder="e.g. Introduction to Bangladesh Economy" 
                      className="text-lg font-bold h-12"
                      onChange={(e) => {
                        setValue("title", e.target.value);
                        setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                      }}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Video className="h-4 w-4" /> YouTube Video URL (Optional)</Label>
                    <Input {...register("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Comprehensive Content</Label>
                    <RichTextEditor 
                      content={watch("content")}
                      onChange={(json) => setValue("content", json)}
                      placeholder="Start drafting your lesson..."
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Lecture Settings</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select onValueChange={(val) => setValue("subjectId", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.nameBn}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Select onValueChange={(val) => setValue("topicId", val)} disabled={!selectedSubjectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.nameBn}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                     <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-success" /> Make Publicly Available</Label>
                        <Switch onCheckedChange={(val) => setValue("status", val ? "PUBLISHED" : "DRAFT")} />
                     </div>
                     <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Lock className="h-4 w-4 text-indigo-500" /> Free Preview</Label>
                        <Switch onCheckedChange={(val) => setValue("isFree", val)} />
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="bg-muted/10 p-6 flex flex-col gap-3">
                  <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg">
                    {loading ? "Publishing..." : <><Save className="mr-2 h-4 w-4" /> Save & Publish</>}
                  </Button>
                  <Button variant="outline" type="button" size="lg" className="w-full" asChild>
                    <Link href="/lectures" target="_blank"><Eye className="mr-2 h-4 w-4" /> Preview View</Link>
                  </Button>
               </CardFooter>
             </Card>

             <Card className="glass-card border-none card-shadow">
                <CardHeader className="bg-muted/30 border-b py-3 px-6">
                   <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-1">
                      <Label className="text-xs">Meta Title</Label>
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
