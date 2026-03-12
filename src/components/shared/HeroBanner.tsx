"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, GraduationCap, PenTool } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background with old project accent gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      
      <div className="container mx-auto">
        <div className="max-w-3xl text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              পড়া শুরু করুন <span className="text-primary">একেবারে সহজেই</span>
              <br />
              <span className="text-3xl sm:text-4xl mt-2 block font-normal text-muted-foreground">
                Strategic Preparation for BCS & Govt Jobs
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground leading-relaxed"
          >
            বাংলাদেশ সরকারি কর্ম কমিশন সহ সকল সরকারি দপ্তরের নিয়োগ প্রস্তুতির একমাত্র নির্ভরযোগ্য প্লাটফর্ম। 
            স্মার্ট উপায়ে শিখুন এবং নিজের উন্নতি যাচাই করুন।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-full shadow-lg px-8">
              <Link href="/lecture">
                পড়া শুরু করুন <GraduationCap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur-sm border-2 px-8">
              <Link href="/exam">
                পরীক্ষা দিন <PenTool className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
