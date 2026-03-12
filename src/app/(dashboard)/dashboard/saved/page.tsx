import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, FileText, Newspaper, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SavedItemsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!user) return null;

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">সংরক্ষিত আইটেম</h1>
        <p className="text-muted-foreground text-lg">Revisit the content you bookmarked for later study.</p>
      </div>

      <Tabs defaultValue="MCQ" className="space-y-8">
        <TabsList className="bg-muted/10 p-1 h-14 rounded-2xl border border-border/50">
          <TabsTrigger value="MCQ" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">MCQs</TabsTrigger>
          <TabsTrigger value="LECTURE" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">Lectures</TabsTrigger>
          <TabsTrigger value="BLOG" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">Blogs</TabsTrigger>
          <TabsTrigger value="CURRENT_AFFAIR" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">Insights</TabsTrigger>
        </TabsList>

        {["MCQ", "LECTURE", "BLOG", "CURRENT_AFFAIR"].map((type) => (
          <TabsContent key={type} value={type} className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.filter(i => i.itemType === type).length > 0 ? (
                  savedItems.filter(i => i.itemType === type).map((item) => (
                    <Card key={item.id} className="glass-card border-none card-shadow group hover:bg-surface-elevated/50 transition-all">
                       <CardContent className="p-8 space-y-4 flex flex-col h-full">
                          <div className="flex justify-between items-center">
                             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                {type === "MCQ" && <HelpCircle className="h-5 w-5" />}
                                {type === "LECTURE" && <FileText className="h-5 w-5" />}
                                {type === "BLOG" && <Newspaper className="h-5 w-5" />}
                                {type === "CURRENT_AFFAIR" && <Bookmark className="h-5 w-5" />}
                             </div>
                             <Badge variant="outline" className="text-[10px] font-black uppercase opacity-50">SAVED</Badge>
                          </div>
                          
                          <h3 className="font-bold text-lg line-clamp-2 leading-tight flex-1">
                             Reference ID: {item.itemId}
                          </h3>

                          <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                             <span className="text-[10px] uppercase font-black text-muted-foreground/50">
                                {new Date(item.createdAt).toLocaleDateString()}
                             </span>
                             <Button variant="ghost" className="rounded-full h-8 px-4 gap-2 text-primary hover:bg-primary/5">
                                View Content <ArrowRight className="h-3 w-3" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
                     <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                        <Bookmark className="h-8 w-8" />
                     </div>
                     <p className="text-muted-foreground font-medium">No saved {type.toLowerCase()}s found yet.</p>
                  </div>
                )}
             </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
