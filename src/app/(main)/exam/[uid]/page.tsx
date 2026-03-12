"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Menu,
  Clock,
  X
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ExamHallPage({ params }: { params: any }) {
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Exam Data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/exam/detail/${params.uid}`); // Need to implement this detail route
        const data = await res.json();
        
        if (data.status === "error") throw new Error(data.message);

        setExam(data);
        setSections(data.sections);
        
        // Flatten all MCQs from sections
        const allMcqs = data.sections.flatMap((s: any) => s.mcqItems);
        setMcqs(allMcqs);
        setTimeLeft(data.totalTime * 60);
      } catch (error: any) {
        toast.error(error.message || "Failed to load exam");
        router.push("/mcq");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [params.uid, router]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0 || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (mcqId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [mcqId]: prev[mcqId] === optionId ? "" : optionId // Toggle
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    if (!confirm("Are you sure you want to finish the exam?")) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          answers,
          timeSpent: exam.totalTime * 60 - timeLeft,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed");

      toast.success("Exam submitted successfully!");
      router.push(`/exam/result/${result.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }, [answers, exam, timeLeft, router]);

  if (loading) return <ExamSkeleton />;
  if (!exam) return null;

  const currentMcq = mcqs[currentIndex];
  const progress = (Object.keys(answers).filter(k => answers[k]).length / mcqs.length) * 100;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="h-16 border-b bg-muted/30 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-bold text-sm lg:text-base truncate max-w-[150px] lg:max-w-md">{exam.title}</h2>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="text-[10px] animate-pulse text-primary border-primary/20">LIVE EXAM</Badge>
               <span className="text-[10px] font-medium text-muted-foreground uppercase">{mcqs.length} Questions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 ${timeLeft < 300 ? 'bg-destructive/10 border-destructive text-destructive animate-bounce' : 'bg-primary/5 border-primary/20 text-primary'}`}>
              <Timer className="h-4 w-4" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
           </div>
           
           <Button onClick={handleSubmit} disabled={submitting} className="shadow-lg hover:shadow-primary/20">
              {submitting ? "Submitting..." : <><CheckCircle className="mr-2 h-4 w-4" /> Finish Exam</>}
           </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="w-80 border-r bg-muted/10 hidden lg:flex flex-col">
          <div className="p-4 border-b space-y-4">
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Attempted</span>
                <span>{Object.values(answers).filter(Boolean).length} / {mcqs.length}</span>
             </div>
             <Progress value={progress} className="h-2" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-5 gap-2 content-start">
             {mcqs.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentIndex(i)}
                 className={`h-10 w-full rounded-lg text-xs font-bold transition-all border ${
                   currentIndex === i 
                   ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground' 
                   : answers[mcqs[i].uid] 
                   ? 'bg-success/10 border-success/30 text-success' 
                   : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                 }`}
               >
                 {i + 1}
               </button>
             ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-muted/5">
           <div className="flex-1 overflow-y-auto p-4 lg:p-12">
              <div className="max-w-3xl mx-auto space-y-8">
                 
                 <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-none">
                      Question {currentIndex + 1} of {mcqs.length}
                    </Badge>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                          <AlertCircle className="h-3 w-3 mr-1" /> Report Error
                       </Button>
                    </div>
                 </div>

                 <Card className="glass-card border-none card-shadow overflow-hidden">
                   <CardContent className="p-8 lg:p-10 space-y-10">
                      <div className="text-xl lg:text-2xl font-bold leading-relaxed">
                        <ContentRenderer content={currentMcq.question} />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                         {(currentMcq.options as any[]).map((opt, i) => (
                           <button
                             key={opt.id}
                             onClick={() => handleSelect(currentMcq.uid, opt.id)}
                             className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left group ${
                               answers[currentMcq.uid] === opt.id 
                               ? 'bg-primary/5 border-primary ring-2 ring-primary/10' 
                               : 'bg-surface-elevated border-border hover:border-primary/50'
                             }`}
                           >
                              <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                                answers[currentMcq.uid] === opt.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              <span className="pt-2 text-lg font-medium">{opt.textPlain}</span>
                           </button>
                         ))}
                      </div>
                   </CardContent>
                 </Card>
              </div>
           </div>

           {/* Mobile Footer Navigation */}
           <footer className="h-20 border-t bg-background px-4 flex items-center justify-between">
              <Button 
                variant="outline" 
                size="lg" 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="rounded-full px-8"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
              </Button>
              
              <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="secondary" size="icon" className="lg:hidden rounded-full">
                       <Menu className="h-5 w-5" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="bottom" className="h-[70vh] rounded-t-[32px]">
                    <SheetHeader>
                       <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-5 gap-3 p-4">
                        {mcqs.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-12 w-full rounded-xl text-xs font-bold transition-all border ${
                              currentIndex === i 
                              ? 'ring-2 ring-primary bg-primary text-primary-foreground' 
                              : answers[mcqs[i].uid] 
                              ? 'bg-success/10 border-success/30 text-success' 
                              : 'bg-muted/50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                    </div>
                 </SheetContent>
              </Sheet>

              <Button 
                variant={currentIndex === mcqs.length - 1 ? "default" : "outline"} 
                size="lg" 
                onClick={() => currentIndex === mcqs.length - 1 ? handleSubmit() : setCurrentIndex(prev => prev + 1)}
                className="rounded-full px-8"
              >
                {currentIndex === mcqs.length - 1 ? "Finish Exam" : "Next"} <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
           </footer>
        </div>
      </main>
    </div>
  );
}

function ExamSkeleton() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center space-y-8 p-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="text-xl font-bold text-muted-foreground animate-pulse">Initializing Secure Exam Environment...</p>
    </div>
  );
}
