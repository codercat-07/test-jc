"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobNoticeSchema, JobNoticeInput } from "@/lib/validations/job";
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
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { 
  Briefcase, 
  Calendar, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Save, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

export default function AdminNewJobNoticePage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobNoticeInput>({
    resolver: zodResolver(jobNoticeSchema),
    defaultValues: {
      category: "GOV",
      status: "DRAFT",
      publishedAt: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetch("/api/admin/organizations").then(res => res.json()).then(data => setOrganizations(data));
  }, []);

  const onSubmit = async (data: JobNoticeInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/job-notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Job Notice");

      toast.success("Job notice published");
      router.push("/admin/job-notices");
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
          <Link href="/admin/job-notices"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Post Job Circular</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>Notice Details</CardTitle>
                 <CardDescription>Enter the job title and full circular content</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Title / Job Role</Label>
                    <Input {...register("title")} placeholder="e.g. Senior Officer, Sonali Bank" />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <Select onValueChange={(val) => setValue("organizationId", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map(o => <SelectItem key={o.id} value={o.id}>{o.nameBn}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.organizationId && <p className="text-xs text-destructive">{errors.organizationId.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select onValueChange={(val: any) => setValue("category", val)} defaultValue="GOV">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GOV">Government Job</SelectItem>
                          <SelectItem value="BANK">Bank Job</SelectItem>
                          <SelectItem value="PRIVATE">Private Job</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Circular Image URL</Label>
                    <Input {...register("circularImage")} placeholder="https://..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Information (Body)</Label>
                    <RichTextEditor 
                      content={watch("content")}
                      onChange={(json) => setValue("content", json)}
                      placeholder="Enter detailed notice information..."
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Important Dates
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Published Date</Label>
                    <Input type="date" {...register("publishedAt")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Application Deadline</Label>
                    <Input type="date" {...register("deadline")} />
                  </div>
               </CardContent>
             </Card>

             <Card className="glass-card border-none card-shadow">
                <CardHeader className="bg-muted/30 border-b">
                   <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                     <LinkIcon className="h-4 w-4" /> Links & Status
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-2">
                      <Label>Apply URL</Label>
                      <Input {...register("applicationUrl")} placeholder="https://" />
                   </div>
                   <div className="space-y-2">
                      <Label>Status</Label>
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
                <CardFooter className="p-6 border-t bg-muted/5">
                   <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg h-14 text-lg">
                      {loading ? "Posting..." : <><Save className="mr-2 h-5 w-5" /> Post Circular</>}
                   </Button>
                </CardFooter>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
