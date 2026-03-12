import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  Bookmark, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      examAttempts: {
        include: { exam: { select: { title: true } } },
        orderBy: { submittedAt: "desc" },
        take: 5
      },
      savedItems: {
        orderBy: { createdAt: "desc" },
        take: 3
      }
    }
  });

  if (!user) return null;

  // Compute Stats
  const examsTaken = user.examAttempts.length;
  const totalCorrect = user.examAttempts.reduce((acc, curr) => acc + curr.correct, 0);
  const totalIncorrect = user.examAttempts.reduce((acc, curr) => acc + curr.incorrect, 0);
  const totalAttempted = totalCorrect + totalIncorrect;
  const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
  const itemsSaved = await prisma.savedItem.count({ where: { userId: user.id } });

  return (
    <div className="space-y-12">
      {/* Greeting Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="h-20 w-20 rounded-full border-4 border-primary/20 p-1">
              <img src={user.avatar || ""} className="h-full w-full rounded-full object-cover" alt={user.name} />
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tight">স্বাগতম, {user.name}!</h1>
              <p className="text-muted-foreground mt-1">Ready to continue your preparation today?</p>
           </div>
        </div>
        <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/50">
           <Button variant="ghost" className="rounded-xl h-12 gap-2 text-primary hover:bg-primary/10">
              <Zap className="h-4 w-4" /> My Streak: 12 Days
           </Button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "MCQs Practiced", value: totalAttempted, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Overall Accuracy", value: `${accuracy.toFixed(1)}%`, icon: Target, color: "text-green-500", bg: "bg-green-500/10" },
           { label: "Exams Taken", value: examsTaken, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
           { label: "Items Saved", value: itemsSaved, icon: Bookmark, color: "text-purple-500", bg: "bg-purple-500/10" },
         ].map((stat, i) => (
           <Card key={i} className="glass-card border-none card-shadow-lg group">
              <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground/30" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight mb-1">{stat.value}</h2>
                 <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Performance Section (Placeholder Charts Implementation) */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-none card-shadow-lg h-[400px]">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-primary" /> Exam History
                  </CardTitle>
                  <CardDescription>Performance tracking over the last 7 attempts</CardDescription>
               </CardHeader>
               <CardContent className="flex items-center justify-center pt-8">
                  {/* Recharts integration would go here, using a placeholder for now */}
                  <div className="w-full h-48 bg-muted/10 rounded-3xl border-2 border-dashed flex items-center justify-center text-muted-foreground/30">
                     Interactive Chart Visualization
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Activity */}
         <div className="space-y-8 text-secondary-foreground">
            <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <Calendar className="h-5 w-5" /> Recent Activity
            </h3>
            <div className="space-y-4">
               {user.examAttempts.length > 0 ? user.examAttempts.map((attempt) => (
                 <div key={attempt.id} className="p-5 rounded-[32px] bg-muted/20 border border-border/50 group hover:bg-surface-elevated/50 transition-all flex items-center justify-between">
                    <div>
                       <h4 className="font-bold line-clamp-1">{attempt.exam.title}</h4>
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mt-1">
                          Score: {attempt.score.toFixed(1)} • {new Date(attempt.submittedAt).toLocaleDateString()}
                       </p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors" asChild>
                       <Link href={`/exam/result/${attempt.id}`}><ChevronRight className="h-5 w-5" /></Link>
                    </Button>
                 </div>
               )) : (
                 <p className="text-muted-foreground text-sm italic">No recent attempts found.</p>
               )}
            </div>
            
            <Button className="w-full rounded-2xl h-14 font-bold shadow-lg shadow-primary/20" asChild>
               <Link href="/mcq">Start New Practice session</Link>
            </Button>
         </div>

      </div>
    </div>
  );
}
