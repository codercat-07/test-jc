import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ContentRenderer from "@/components/shared/ContentRenderer";
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Trophy, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ExamResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: true,
      result: true,
    },
  });

  if (!attempt || !attempt.result) {
    notFound();
  }

  const { result, exam } = attempt;
  const questionsTotal = result.correctCount + result.wrongCount + result.skippedCount;
  const accuracy = questionsTotal > 0 ? (result.correctCount / (result.correctCount + result.wrongCount)) * 100 : 0;

  // Fetch the questions for review
  const mcqUids = (result.answers as any[]).map(a => a.mcqUid);
  const mcqs = await prisma.mCQ.findMany({
    where: { uid: { in: mcqUids } }
  });
  const mcqMap = new Map(mcqs.map(m => [m.uid, m]));

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      
      {/* Result Overview */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-1">Exam Result</Badge>
           <h1 className="text-4xl font-extrabold tracking-tight">{exam.title}</h1>
           <p className="text-muted-foreground">Well done! Here is your performance breakdown.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="glass-card border-none card-shadow bg-primary/5 ring-2 ring-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                 <Trophy className="h-12 w-12 text-primary mx-auto" />
                 <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Score</p>
                    <h2 className="text-5xl font-black text-primary">{result.totalMarks.toFixed(2)}</h2>
                 </div>
                 <Badge variant="outline" className="border-primary/20">Passing: {exam.passMark || "N/A"}</Badge>
              </CardContent>
           </Card>

           <Card className="glass-card border-none card-shadow md:col-span-2">
              <CardContent className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Correct</p>
                    <p className="text-2xl font-bold text-success flex items-center gap-2">
                       <CheckCircle2 className="h-5 w-5" /> {result.correctCount}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Wrong</p>
                    <p className="text-2xl font-bold text-destructive flex items-center gap-2">
                       <XCircle className="h-5 w-5" /> {result.wrongCount}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Accuracy</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                       <BarChart3 className="h-5 w-5 text-indigo-500" /> {accuracy.toFixed(1)}%
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Time Taken</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                       <Clock className="h-5 w-5 text-amber-500" /> {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="flex justify-between items-center py-4">
           <h3 className="text-2xl font-bold">Answer Review</h3>
           <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                 <Link href="/dashboard/results">My Exams</Link>
              </Button>
              <Button asChild size="sm">
                 <Link href="/mcq">More Practice</Link>
              </Button>
           </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-6">
           {(result.answers as any[]).map((ans, i) => {
             const mcq = mcqMap.get(ans.mcqUid);
             if (!mcq) return null;
             
             return (
               <Card key={ans.mcqUid} className="glass-card border-none card-shadow overflow-hidden group">
                  <div className={`h-1 w-full ${ans.isCorrect ? 'bg-success' : ans.userOptionId ? 'bg-destructive' : 'bg-muted'}`} />
                  <CardContent className="p-8 space-y-6">
                     <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">Q{i + 1}</Badge>
                              {ans.isCorrect ? (
                                <Badge className="bg-success/10 text-success border-none">Correct</Badge>
                              ) : ans.userOptionId ? (
                                <Badge className="bg-destructive/10 text-destructive border-none">Wrong</Badge>
                              ) : (
                                <Badge className="bg-muted/10 text-muted-foreground border-none">Skipped</Badge>
                              )}
                           </div>
                           <div className="prose prose-sm dark:prose-invert max-w-none font-semibold">
                              <ContentRenderer content={mcq.question} />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(mcq.options as any[]).map((opt, j) => {
                           const isUserChoice = ans.userOptionId === opt.id;
                           const isCorrectChoice = opt.isCorrect;
                           
                           return (
                             <div 
                               key={opt.id} 
                               className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                 isCorrectChoice 
                                 ? 'bg-success/5 border-success/30' 
                                 : isUserChoice 
                                 ? 'bg-destructive/5 border-destructive/30' 
                                 : 'bg-muted/10 border-transparent'
                               }`}
                             >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrectChoice ? 'bg-success text-white' : isUserChoice ? 'bg-destructive text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                   {String.fromCharCode(65 + j)}
                                </div>
                                <span className={`text-sm ${isCorrectChoice ? 'font-bold text-success' : isUserChoice ? 'font-bold text-destructive' : ''}`}>
                                   {opt.textPlain}
                                </span>
                             </div>
                           );
                        })}
                     </div>

                     {mcq.explanation && (
                       <div className="p-6 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 space-y-2">
                          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                             <ArrowRight className="h-3 w-3" /> Explanation
                          </p>
                          <div className="prose prose-xs dark:prose-invert">
                             <ContentRenderer content={mcq.explanation} />
                          </div>
                       </div>
                     )}
                  </CardContent>
               </Card>
             );
           })}
        </div>
      </div>
    </div>
  );
}
