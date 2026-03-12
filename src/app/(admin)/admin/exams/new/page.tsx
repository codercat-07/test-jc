"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, ExamInput } from "@/lib/validations/exam";
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
import { Search, Plus, Trash2, ArrowLeft, Save, GripVertical, CheckCircle, Clock, Award } from "lucide-react";
import Link from "next/link";

export default function AdminNewExamPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [examSections, setExamSections] = useState<any[]>([]);
  const [mcqSearch, setMcqSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      totalTime: 60,
      perCorrectMark: 1,
      perWrongMark: 0.25,
      isLive: false,
      status: "DRAFT",
      sections: [
        { sectionId: "general", mcqUids: [], order: 0 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  useEffect(() => {
    // Fetch dependencies
    fetch("/api/admin/organizations").then(res => res.json()).then(data => setOrganizations(data));
    // Fetch standard sections from site settings
    fetch("/api/admin/settings?key=exam_sections").then(res => res.json()).then(data => setExamSections(data.value || []));
  }, []);

  const searchMcqs = async () => {
    if (!mcqSearch) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/mcq?q=${mcqSearch}`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (error) {
      toast.error("MCQ Search failed");
    } finally {
      setSearching(false);
    }
  };

  const addMcqToSection = (sectionIndex: number, uid: string) => {
    const currentUids = watch(`sections.${sectionIndex}.mcqUids`);
    if (currentUids.includes(uid)) {
      toast.error("MCQ already in this section");
      return;
    }
    setValue(`sections.${sectionIndex}.mcqUids`, [...currentUids, uid]);
    toast.success(`Added ${uid}`);
  };

  const removeMcqFromSection = (sectionIndex: number, mcqIndex: number) => {
    const currentUids = [...watch(`sections.${sectionIndex}.mcqUids`)];
    currentUids.splice(mcqIndex, 1);
    setValue(`sections.${sectionIndex}.mcqUids`, currentUids);
  };

  const onSubmit = async (data: ExamInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Exam");

      toast.success("Exam created successfully");
      router.push("/admin/exams");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/exams"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Exam</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Meta & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card border-none card-shadow">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Exam Title</Label>
                  <Input {...register("title")} placeholder="e.g. 46th BCS Model Test" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input {...register("slug")} placeholder="e.g. 46th-bcs-model-test" />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Select onValueChange={(val) => setValue("organizationId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map(o => (
                        <SelectItem key={o.id} value={o.id}>{o.nameBn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-none card-shadow">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Exam Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Is Live Exam?</Label>
                    <p className="text-xs text-muted-foreground">Requires start/end times</p>
                  </div>
                  <Switch checked={watch("isLive")} onCheckedChange={(val) => setValue("isLive", val)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Clock className="h-3 w-3" /> Time (Min)</Label>
                    <Input type="number" {...register("totalTime", { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Award className="h-3 w-3" /> Pass Mark</Label>
                     <Input type="number" {...register("passMark", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-success">Correct Mark</Label>
                    <Input type="number" step="0.1" {...register("perCorrectMark", { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-destructive">Wrong Penalty</Label>
                    <Input type="number" step="0.01" {...register("perWrongMark", { valueAsNumber: true })} />
                  </div>
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
            </Card>

            <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg h-14 text-lg">
               {loading ? "Creating..." : <><Save className="mr-2 h-5 w-5" /> Finish & Create</>}
            </Button>
          </div>

          {/* Right Column: Question Builder */}
          <div className="lg:col-span-2 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                 <div>
                   <CardTitle>Exam Content</CardTitle>
                   <CardDescription>Structure your exam into sections and add MCQs</CardDescription>
                 </div>
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ sectionId: "general", mcqUids: [], order: fields.length })}>
                   <Plus className="h-4 w-4 mr-2" /> Add Section
                 </Button>
               </CardHeader>
               <CardContent className="p-6 space-y-8">
                  {fields.map((field, sIndex) => (
                    <div key={field.id} className="space-y-4 p-6 rounded-2xl bg-muted/20 border border-border relative">
                       <Button 
                         type="button" 
                         variant="ghost" 
                         size="icon" 
                         className="absolute top-4 right-4 text-destructive"
                         onClick={() => remove(sIndex)}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>

                       <div className="flex gap-4 items-end max-w-sm">
                          <div className="flex-1 space-y-2">
                            <Label>Section Name</Label>
                            <Select 
                              onValueChange={(val) => setValue(`sections.${sIndex}.sectionId`, val)}
                              defaultValue={field.sectionId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="General" />
                              </SelectTrigger>
                              <SelectContent>
                                {examSections.map(s => <SelectItem key={s.id} value={s.id}>{s.nameBn}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <Badge variant="secondary" className="mb-2">
                            {watch(`sections.${sIndex}.mcqUids`).length} MCQs
                          </Badge>
                       </div>

                       <div className="space-y-4">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search and Add MCQs</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Search by UID or question content..." 
                                className="pl-9 bg-background"
                                value={mcqSearch}
                                onChange={(e) => setMcqSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchMcqs())}
                              />
                            </div>
                            <Button type="button" onClick={searchMcqs} disabled={searching}>
                              {searching ? "Searching..." : "Search"}
                            </Button>
                          </div>

                          {searchResults.length > 0 && (
                            <div className="bg-background rounded-xl border border-border shadow-2xl max-h-[300px] overflow-auto p-2 space-y-1 z-20">
                              {searchResults.map(result => (
                                <div key={result.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted group transition-all">
                                  <div className="flex-1 min-w-0 pr-4">
                                     <Badge variant="outline" className="text-[10px] mb-1">{result.uid}</Badge>
                                     <p className="text-sm truncate">{result.questionPlain}</p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    type="button"
                                    onClick={() => addMcqToSection(sIndex, result.uid)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2 mt-6">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selected Questions</Label>
                            <div className="border border-border rounded-xl overflow-hidden bg-background">
                              {watch(`sections.${sIndex}.mcqUids`).length > 0 ? (
                                watch(`sections.${sIndex}.mcqUids`).map((uid, mIndex) => (
                                  <div key={uid} className="flex items-center justify-between p-3 border-b last:border-b-0 group">
                                    <div className="flex items-center gap-3">
                                      <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                                      <span className="text-xs font-bold">{mIndex + 1}.</span>
                                      <span className="text-sm font-medium">{uid}</span>
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => removeMcqFromSection(sIndex, mIndex)}
                                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                  No questions added yet. Use search above.
                                </div>
                              )}
                            </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </CardContent>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
