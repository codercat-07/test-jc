"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currentAffairsSchema, CurrentAffairsInput } from "@/lib/validations/current-affairs";
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
  Newspaper, 
  Calendar, 
  Save, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AdminNewCurrentAffairsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CurrentAffairsInput>({
    resolver: zodResolver(currentAffairsSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      category: "BANGLADESH",
      status: "DRAFT",
    },
  });

  const onSubmit = async (data: CurrentAffairsInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/current-affairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save Current Affairs");

      toast.success("News digest added");
      router.push("/admin/current-affairs");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
       <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/current-affairs"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add News Digest</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle>Content Body</CardTitle>
                 <CardDescription>Enter the news headline and detailed report</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input {...register("title")} placeholder="e.g. Bangladesh Prime Minister visits India" />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Detailed Report</Label>
                    <RichTextEditor 
                      content={watch("content")}
                      onChange={(json) => setValue("content", json)}
                      placeholder="Enter the full news report here..."
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <Card className="glass-card border-none card-shadow">
               <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Temporal Data
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Month</Label>
                        <Select onValueChange={(val) => setValue("month", parseInt(val))} defaultValue={watch("month").toString()}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((m, i) => <SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label>Year</Label>
                        <Input type="number" {...register("year", { valueAsNumber: true })} />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={(val: any) => setValue("category", val)} defaultValue="BANGLADESH">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANGLADESH">Bangladesh</SelectItem>
                        <SelectItem value="INTERNATIONAL">International</SelectItem>
                        <SelectItem value="SPORTS">Sports</SelectItem>
                        <SelectItem value="ECONOMY">Economy</SelectItem>
                        <SelectItem value="SCIENCE">Science & Tech</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </CardContent>
             </Card>

             <Card className="glass-card border-none card-shadow">
                <CardHeader className="bg-muted/30 border-b">
                   <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                     <Newspaper className="h-4 w-4" /> Publishing
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
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
                      {loading ? "Adding..." : <><Save className="mr-2 h-5 w-5" /> Add to Digest</>}
                   </Button>
                </CardFooter>
             </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
