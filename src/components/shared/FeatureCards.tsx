"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, 
  Briefcase, 
  PenTool, 
  Newspaper, 
  Edit3, 
  Database, 
  FileText, 
  Bell 
} from "lucide-react";

const cards = [
  {
    title: "Lecture/Module",
    titleBn: "লেকচার মডিউল",
    desc: "বিস্তারিত আলোচনা ও টিপস",
    icon: BookOpen,
    href: "/lecture",
    gradient: "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    title: "Job Solution",
    titleBn: "জব সলিউশন",
    desc: "বিগত বছরের প্রশ্ন সমাধান",
    icon: Briefcase,
    href: "/job-solution",
    gradient: "from-indigo-500/10 to-indigo-600/10 hover:from-indigo-500/20",
    iconColor: "text-indigo-600",
  },
  {
    title: "Exam Hall",
    titleBn: "পরীক্ষা হল",
    desc: "লাইভ মডেল টেস্ট",
    icon: PenTool,
    href: "/exam",
    gradient: "from-purple-500/10 to-purple-600/10 hover:from-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    title: "Current Affairs",
    titleBn: "সাম্প্রতিক তথ্য",
    desc: "দেশ ও বিদেশের খবর",
    icon: Newspaper,
    href: "/current-affairs",
    gradient: "from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20",
    iconColor: "text-cyan-600",
  },
  {
    title: "Written Exam",
    titleBn: "লিখিত প্রস্তুতি",
    desc: "লিখিত পরীক্ষার গাইড",
    icon: Edit3,
    href: "/written-exam",
    gradient: "from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  {
    title: "Data Vault",
    titleBn: "তথ্য ভান্ডার",
    desc: "নোটস ও শিটস আর্কাইভ",
    icon: Database,
    href: "/data-vault",
    gradient: "from-orange-500/10 to-orange-600/10 hover:from-orange-500/20",
    iconColor: "text-orange-600",
  },
  {
    title: "Blog",
    titleBn: "ব্লগ",
    desc: "বিশেষজ্ঞদের পরামর্শ",
    icon: FileText,
    href: "/blog",
    gradient: "from-pink-500/10 to-pink-600/10 hover:from-pink-500/20",
    iconColor: "text-pink-600",
  },
  {
    title: "Job Notices",
    titleBn: "নিয়োগ বিজ্ঞপ্তি",
    desc: "সবার আগে আপডেট",
    icon: Bell,
    href: "/job-notices",
    gradient: "from-yellow-500/10 to-yellow-600/10 hover:from-yellow-500/20",
    iconColor: "text-yellow-600",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={card.href} className="group block h-full">
                <div className={`h-full p-8 rounded-3xl bg-gradient-to-br border border-transparent group-hover:border-primary/20 transition-all ${card.gradient}`}>
                  <div className={`h-12 w-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all ${card.iconColor}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{card.title}</h3>
                  <p className="text-xl font-bold text-foreground/80 mb-2 bengali">{card.titleBn}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
