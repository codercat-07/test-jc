"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, ResourceInput } from "@/lib/validations/resource";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  FileText, 
  CloudUpload, 
  Save, 
  ArrowLeft,
  FileBox,
  Lock,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function AdminNewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceInput>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      fileType: "PDF",
      status: "DRAFT",
      isFree: true,
    },
  });

  const onSubmit = async (data: ResourceInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Resource");

      toast.success("Resource added to Vault");
      router.push("/admin/resources");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/resources"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resource</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>File Details</CardTitle>
                 <CardDescription>Enter file metadata and access URL</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Resource Title</Label>
                    <Input {...register("title")} placeholder="e.g. BCS 45th Preliminary Question PDF" />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Textarea {...register("description")} placeholder="What's inside this file?" className="h-24 resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><CloudUpload className="h-4 w-4" /> File URL</Label>
                      <Input {...register("fileUrl")} placeholder="https://..." />
                      {errors.fileUrl && <p className="text-xs text-destructive">{errors.fileUrl.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>File Type</Label>
                      <Select onValueChange={(val) => setValue("fileType", val)} defaultValue="PDF">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF Document</SelectItem>
                          <SelectItem value="DOCX">Word Document</SelectItem>
                          <SelectItem value="XLSX">Excel Sheet</SelectItem>
                          <SelectItem value="JPG">Image (JPG)</SelectItem>
                          <SelectItem value="ZIP">Archive (ZIP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>File Size (Bytes - Optional)</Label>
                    <Input type="number" {...register("fileSize", { valueAsNumber: true })} placeholder="e.g. 1048576 for 1MB" />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileBox className="h-4 w-4" /> Categorization
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
                        <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                        <SelectItem value="question_bank">Question Bank</SelectItem>
                        <SelectItem value="syllabus">Syllabus</SelectItem>
                        <SelectItem value="routine">Class Routine</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                     <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-success" /> Visible to All</Label>
                        <Switch onCheckedChange={(val) => setValue("status", val ? "PUBLISHED" : "DRAFT")} />
                     </div>
                     <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2"><Lock className="h-4 w-4 text-indigo-500" /> Free Resource</Label>
                        <Switch defaultChecked onCheckedChange={(val) => setValue("isFree", val)} />
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="p-6 border-t bg-muted/5">
                  <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg h-14 text-lg">
                    {loading ? "Adding..." : <><Save className="mr-2 h-5 w-5" /> Add Resource</>}
                  </Button>
               </CardFooter>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
