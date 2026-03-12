import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileSearch, ChevronRight, BarChart2 } from "lucide-react";

export default async function ExamHistoryPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      examAttempts: {
        include: { exam: { select: { title: true } } },
        orderBy: { submittedAt: "desc" },
      }
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">পরীক্ষার ইতিহাস</h1>
        <p className="text-muted-foreground text-lg">A detailed log of your performance across all exams taken.</p>
      </div>

      <div className="glass-card border-none card-shadow-xl rounded-[40px] overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest">Exam Title</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Score</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Accuracy</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Date</TableHead>
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.examAttempts.length > 0 ? user.examAttempts.map((attempt) => {
              const accuracy = ((attempt.correct / (attempt.correct + attempt.incorrect)) * 100) || 0;
              return (
                <TableRow key={attempt.id} className="hover:bg-primary/5 transition-colors border-border/50 group">
                  <TableCell className="py-6 px-8">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                           <BarChart2 className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight line-clamp-1">{attempt.exam.title}</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-6 text-center font-black text-lg">
                    {attempt.score.toFixed(1)}
                  </TableCell>
                  <TableCell className="py-6 text-center">
                    <Badge variant="outline" className={`rounded-lg px-3 ${accuracy > 70 ? 'text-success border-success/20 bg-success/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                       {accuracy.toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-center text-muted-foreground font-medium text-sm">
                    {new Date(attempt.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    <Button variant="ghost" size="sm" className="rounded-full gap-2 hover:bg-primary hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-primary/20" asChild>
                       <Link href={`/exam/result/${attempt.id}`}>
                          Review <ChevronRight className="h-4 w-4" />
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={5} className="py-32 text-center text-muted-foreground italic">
                   <div className="flex flex-col items-center gap-4">
                      <FileSearch className="h-12 w-12 opacity-20" />
                      <span>No exam attempts recorded yet.</span>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
