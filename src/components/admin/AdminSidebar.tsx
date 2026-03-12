"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Newspaper, 
  Briefcase, 
  Settings, 
  Users, 
  MessageSquare,
  FileBox,
  MonitorPlay,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: ClipboardList, label: "Manage MCQs", href: "/admin/mcq" },
  { icon: BookOpen, label: "Exams", href: "/admin/exams" },
  { icon: MonitorPlay, label: "Lectures", href: "/admin/lectures" },
  { icon: Newspaper, label: "Blog", href: "/admin/blog" },
  { icon: Briefcase, label: "Job Notices", href: "/admin/job-notices" },
  { icon: FileBox, label: "Resources", href: "/admin/resources" },
  { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: Settings, label: "Site Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-muted/20 border-r border-border/50 h-screen sticky top-0 flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-3 px-3 mb-12">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">B</div>
        <div>
          <h2 className="text-lg font-black tracking-tight leading-none uppercase italic">BD-LMS</h2>
          <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Control Center</span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "opacity-50 group-hover:opacity-100")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-border/50">
         <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1 italic">System Health</p>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
               <div className="h-full w-4/5 bg-primary" />
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-tighter">Everything running smooth</p>
         </div>
      </div>
    </aside>
  );
}
