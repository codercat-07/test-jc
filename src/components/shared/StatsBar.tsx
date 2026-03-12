import { prisma } from "@/lib/prisma";
import { Users, FileQuestion, GraduationCap, Layers } from "lucide-react";

export default async function StatsBar() {
  // Parallel fetching with revalidate (Next.js 15 pattern for explicit caching)
  const [userCount, mcqCount, examCount, topicCount] = await Promise.all([
    prisma.user.count(),
    prisma.mCQ.count(),
    prisma.exam.count(),
    prisma.topic.count(),
  ]);

  const stats = [
    { label: "MCQ Practice", value: mcqCount, icon: FileQuestion, color: "text-blue-500" },
    { label: "Model Exams", value: examCount, icon: GraduationCap, color: "text-purple-500" },
    { label: "Active Users", value: userCount, icon: Users, color: "text-cyan-500" },
    { label: "Topics Covered", value: topicCount, icon: Layers, color: "text-orange-500" },
  ];

  return (
    <section className="bg-surface/50 border-y py-8 backdrop-blur-sm">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center justify-center gap-4 text-center lg:text-left">
              <div className={`p-3 rounded-2xl bg-background shadow-sm ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
