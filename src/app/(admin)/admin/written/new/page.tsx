"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { writtenExamSchema, WrittenExamInput } from "@/lib/validations/written";
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
  PenTool, 
  FileCheck, 
  Save, 
  ArrowLeft,
  Settings,
  Eye,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function AdminNewWrittenExamPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WrittenExamInput>({
    resolver: zodResolver(writtenExamSchema),
    defaultValues: {
      content: null,
      solution: null,
      status: "DRAFT",
    },
  });

  useEffect(() => {
    fetch("/api/admin/subjects").then(res => res.json()).then(data => setSubjects(data));
  }, []);

  const onSubmit = async (data: WrittenExamInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/written", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Written Exam");

      toast.success("Written Exam (CQ) published");
      router.push("/admin/written");
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
          <Link href="/admin/written"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Written Exam (CQ)</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>Exam Content</CardTitle>
                 <CardDescription>Enter the descriptive question and the model solution</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-8">
                  <div className="space-y-2">
                    <Label>Exam Title / Question Heading</Label>
                    <Input 
                      {...register("title")} 
                      placeholder="e.g. 45th BCS Written - Bangladesh Affairs" 
                      className="text-lg font-bold h-12"
                      onChange={(e) => {
                        setValue("title", e.target.value);
                        setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                      }}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-primary font-bold"><PenTool className="h-4 w-4" /> Descriptive Question</Label>
                    <RichTextEditor 
                      content={watch("content")}
                      onChange={(json) => setValue("content", json)}
                      placeholder="Enter the main question body here..."
                    />
                  </div>

                  <div className="space-y-4 pt-6 border-t border-dashed">
                    <Label className="flex items-center gap-2 text-success font-bold"><FileCheck className="h-4 w-4" /> Sample Solution / Model Answer</Label>
                    <RichTextEditor 
                      content={watch("solution")}
                      onChange={(json) => setValue("solution", json)}
                      placeholder="Enter the ideal sample solution for students..."
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Meta Settings
                  </CardTitle>
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

                  <div className="pt-4 border-t space-y-4">
                     <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-success" /> Publicly Available</Label>
                        <Switch onCheckedChange={(val) => setValue("status", val ? "PUBLISHED" : "DRAFT")} />
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="p-6 border-t bg-muted/5 flex flex-col gap-3">
                  <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg">
                    {loading ? "Publishing..." : <><Save className="mr-2 h-4 w-4" /> Publish Exam</>}
                  </Button>
                   <Button variant="outline" type="button" className="w-full" asChild>
                    <Link href="/written" target="_blank"><Eye className="mr-2 h-4 w-4" /> Preview List</Link>
                  </Button>
               </CardFooter>
             </Card>

             <Card className="glass-card border-none card-shadow">
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
