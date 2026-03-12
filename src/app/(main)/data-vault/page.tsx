import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Search, 
  FileBox, 
  Filter, 
  HardDrive,
  Info,
  Calendar,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function DataVaultPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;

  const where: any = {
    status: "PUBLISHED",
  };

  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const categories = [
    { id: "lecture_notes", name: "Lecture Notes", icon: FileText },
    { id: "question_bank", name: "Question Bank", icon: FileBox },
    { id: "syllabus", name: "Official Syllabus", icon: Info },
    { id: "routine", name: "Class Routine", icon: Calendar },
  ];

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "N/A";
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
           <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 mb-2">রিসোর্স ও শটকাট</Badge>
           <h1 className="text-5xl font-black tracking-tighter leading-none flex items-center gap-4">
              <HardDrive className="h-12 w-12 text-primary" /> Data Vault
           </h1>
           <p className="text-muted-foreground text-lg max-w-xl">
              Your digital library for PDF notes, previous year questions, and essential academic resources.
           </p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search resources..." 
                className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" 
              />
           </div>
           <Button className="rounded-full px-8 h-12 shadow-lg">Find</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-8">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                 <Filter className="h-4 w-4" /> categories
              </h3>
              <div className="space-y-2">
                 <Button variant="ghost" className="w-full justify-start text-sm hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6">
                    All Resources
                 </Button>
                 {categories.map(cat => (
                    <Button key={cat.id} variant="ghost" className="w-full justify-start text-sm hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6">
                       <cat.icon className="h-4 w-4 mr-3 opacity-50" /> {cat.name}
                    </Button>
                 ))}
              </div>
           </div>

           <Card className="glass-card border-none bg-primary/5 p-6 rounded-[32px] space-y-4">
              <h4 className="font-bold text-primary flex items-center gap-2">
                 <Lock className="h-4 w-4" /> Membership?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 Some resources are exclusive to premium members. Upgrade to unlock full access.
              </p>
              <Button size="sm" className="w-full rounded-full">Upgrade Now</Button>
           </Card>
        </aside>

        {/* Resource Grid */}
        <div className="lg:col-span-3">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((item: any) => (
                <Card key={item.id} className="glass-card border-none card-shadow group overflow-hidden hover:bg-surface-elevated/50 transition-all duration-300">
                   <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                            <FileText className="h-8 w-8" />
                         </div>
                         <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] uppercase font-bold px-2">
                            {item.fileType}
                         </Badge>
                      </div>

                      <div>
                         <h3 className="text-xl font-bold tracking-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {item.title}
                         </h3>
                         <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed h-8">
                            {item.description}
                         </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                         <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-tighter">
                            Size: {formatFileSize(item.fileSize)}
                         </div>
                         <Button asChild size="sm" className="rounded-full px-6 shadow-md hover:shadow-primary/20">
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                               <Download className="h-4 w-4" /> Download
                            </a>
                         </Button>
                      </div>
                   </CardContent>
                </Card>
              ))}

              {resources.length === 0 && (
                 <div className="md:col-span-2 py-32 text-center space-y-4 bg-muted/5 rounded-[48px] border-2 border-dashed">
                    <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                       <FileBox className="h-10 w-10" />
                    </div>
                    <p className="text-muted-foreground font-medium">No resources found in the vault.</p>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
