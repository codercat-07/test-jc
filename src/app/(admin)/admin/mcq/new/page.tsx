"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mcqSchema, McqInput } from "@/lib/validations/mcq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { nanoid } from "nanoid";
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminNewMcqPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<McqInput>({
    resolver: zodResolver(mcqSchema),
    defaultValues: {
      question: null,
      questionPlain: "",
      options: [
        { id: nanoid(), text: null, textPlain: "", isCorrect: true },
        { id: nanoid(), text: null, textPlain: "", isCorrect: false },
        { id: nanoid(), text: null, textPlain: "", isCorrect: false },
        { id: nanoid(), text: null, textPlain: "", isCorrect: false },
      ],
      status: "DRAFT",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const selectedSubjectId = watch("subjectId");

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [subRes, orgRes] = await Promise.all([
          fetch("/api/admin/subjects"), // I will need to create this route
          fetch("/api/admin/organizations") // And this one
        ]);
        
        // Fallback for demo if routes not yet ready
        if (subRes.ok) setSubjects(await subRes.json());
        if (orgRes.ok) setOrganizations(await orgRes.json());
      } catch (error) {
        console.error("Failed to fetch dependencies", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      // Fetch topics for selected subject
      fetch(`/api/admin/topics?subjectId=${selectedSubjectId}`)
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(() => setTopics([]));
    } else {
      setTopics([]);
    }
  }, [selectedSubjectId]);

  const onSubmit = async (data: McqInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save MCQ");

      toast.success("MCQ saved successfully");
      router.push("/admin/mcq");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/mcq"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New MCQ</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="glass-card border-none card-shadow overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Question Content</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <RichTextEditor
                content={watch("question")}
                onChange={(json) => {
                  setValue("question", json);
                  // Extract plain text for search purposes (simple fallback)
                  setValue("questionPlain", JSON.stringify(json).replace(/<[^>]*>/g, ""));
                }}
                placeholder="Type your question here..."
              />
              {errors.questionPlain && (
                <p className="text-sm text-destructive">{errors.questionPlain.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Options</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ id: nanoid(), text: null, textPlain: "", isCorrect: false })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-muted/20 p-4 rounded-xl border border-border">
                    <div className="pt-2">
                      <Checkbox 
                        checked={watch(`options.${index}.isCorrect`)}
                        onCheckedChange={(checked) => {
                          // Allow only one correct option (optional behavior)
                          fields.forEach((_, i) => setValue(`options.${i}.isCorrect`, i === index ? !!checked : false));
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        placeholder={`Option ${index + 1}`}
                        {...register(`options.${index}.textPlain`)}
                        className="bg-background"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {errors.options && (
                <p className="text-sm text-destructive">{errors.options.message}</p>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <Label>Explanation</Label>
              <RichTextEditor
                content={watch("explanation")}
                onChange={(json) => setValue("explanation", json)}
                placeholder="Add an explanation for the correct answer..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card border-none card-shadow">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select onValueChange={(val) => setValue("subjectId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.nameBn}</SelectItem>
                    ))}
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
                    {topics.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.nameBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <CardTitle>Meta & Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="space-y-2">
                <Label>Exam Heading</Label>
                <Input {...register("examHeading")} placeholder="e.g. 45th BCS" />
              </div>

               <div className="space-y-2">
                <Label>Publish Status</Label>
                <Select onValueChange={(val: any) => setValue("status", val)} defaultValue="DRAFT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 pb-12">
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/admin/mcq">Cancel</Link>
          </Button>
          <Button type="submit" size="lg" disabled={loading} className="px-8 shadow-lg">
            {loading ? "Saving..." : <><Save className="mr-2 h-5 w-5" /> Save MCQ</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
