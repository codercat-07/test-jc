import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Activity,
  ArrowUpRight,
  UserPlus,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [userCount, mcqCount, examCount, attemptCount, pendingReports] = await Promise.all([
    prisma.user.count(),
    prisma.mcq.count(),
    prisma.exam.count(),
    prisma.examAttempt.count(),
    prisma.report.count({ where: { status: "PENDING" } })
  ]);

  const stats = [
    { label: "Total Students", value: userCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", growth: "+12%" },
    { label: "Active MCQs", value: mcqCount, icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10", growth: "+5%" },
    { label: "Published Exams", value: examCount, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", growth: "+2" },
    { label: "Total Attempts", value: attemptCount, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10", growth: "+18%" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight leading-none uppercase italic text-primary">Overview</h1>
           <p className="text-muted-foreground mt-2 font-medium">Platform performance and system metrics.</p>
        </div>
        <div className="flex items-center gap-3">
           {pendingReports > 0 && (
             <Badge variant="destructive" className="h-10 px-4 rounded-full gap-2 animate-pulse">
                <AlertCircle className="h-4 w-4" /> {pendingReports} Reports Pending
             </Badge>
           )}
           <Button className="rounded-full px-8 shadow-xl shadow-primary/20">Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <Card key={i} className="glass-card border-none card-shadow-lg overflow-hidden group">
              <CardContent className="p-6 relative">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-success border-success/20 bg-success/5 text-[10px] font-black">
                       {stat.growth}
                    </Badge>
                 </div>
                 <h2 className="text-3xl font-black tracking-tighter mb-1">{stat.value.toLocaleString()}</h2>
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                 
                 <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-none card-shadow-lg h-[450px]">
               <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Growth Analytics</CardTitle>
                    <CardDescription>User registrations vs Exam activity</CardDescription>
                  </div>
                  <select defaultValue="7d" className="bg-muted/20 border-border/50 rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-0 outline-none cursor-pointer">
                    <option value="7d">Last 7 Days</option>
                  </select>
               </CardHeader>
               <CardContent className="flex items-center justify-center pt-8">
                  <div className="w-full h-64 bg-primary/5 rounded-[40px] border-2 border-dashed flex items-center justify-center text-primary/30 font-bold uppercase tracking-widest italic">
                     Data Visualization Layer
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Activity className="h-4 w-4" /> Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
               <Button variant="outline" className="h-16 rounded-[24px] justify-start px-6 gap-4 border-none card-shadow hover:bg-primary hover:text-white transition-all group" asChild>
                  <Link href="/admin/mcq/new">
                     <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-white/20">
                        <UserPlus className="h-4 w-4" />
                     </div>
                     <span className="font-bold">Add New MCQ</span>
                  </Link>
               </Button>
               <Button variant="outline" className="h-16 rounded-[24px] justify-start px-6 gap-4 border-none card-shadow hover:bg-primary hover:text-white transition-all group" asChild>
                  <Link href="/admin/exams/new">
                     <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-white/20">
                        <Trophy className="h-4 w-4" />
                     </div>
                     <span className="font-bold">Create Live Exam</span>
                  </Link>
               </Button>
               <Button variant="outline" className="h-16 rounded-[24px] justify-start px-6 gap-4 border-none card-shadow hover:bg-primary hover:text-white transition-all group" asChild>
                  <Link href="/admin/comments">
                     <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-white/20">
                        <MessageSquare className="h-4 w-4" />
                     </div>
                     <span className="font-bold">Moderate Comments</span>
                  </Link>
               </Button>
            </div>

            <Card className="bg-primary border-none rounded-[40px] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black italic uppercase leading-none">Pro Tip</h4>
                  <p className="text-sm text-white/80 font-medium leading-relaxed">
                     Weekly backups are scheduled every Sunday at 3 AM. Monitor server logs for performance dips.
                  </p>
               </div>
               <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </Card>
         </div>
      </div>
    </div>
  );
}
