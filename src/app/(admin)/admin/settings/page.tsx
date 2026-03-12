import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Globe, 
  Briefcase, 
  Mail, 
  Save, 
  Layout, 
  Database,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findMany();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight leading-none uppercase italic text-primary">Site Settings</h1>
           <p className="text-muted-foreground mt-2 font-medium">Global platform configuration and metadata.</p>
        </div>
        <Button variant="outline" className="rounded-full gap-2 border-primary/20 bg-primary/5 text-primary">
           <RefreshCw className="h-4 w-4" /> Reset to Defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="space-y-12">
            
            {/* General Configuration */}
            <Card className="glass-card border-none card-shadow-xl overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Globe className="h-5 w-5" />
                     </div>
                     <CardTitle>Platform Identity</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                     <Label>Site Title (BN)</Label>
                     <Input defaultValue="বিডি লার্নিং ম্যানেজমেন্ট" placeholder="Bengali Title" />
                  </div>
                  <div className="space-y-2">
                     <Label>Site Title (EN)</Label>
                     <Input defaultValue="BD-LMS" placeholder="English Title" />
                  </div>
                  <div className="space-y-2">
                     <Label>Support Email</Label>
                     <Input defaultValue="support@bd-lms.com" type="email" />
                  </div>
               </CardContent>
               <CardFooter className="bg-muted/5 border-t px-8 py-4">
                  <Button className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20"><Save className="h-4 w-4" /> Save Changes</Button>
               </CardFooter>
            </Card>

            {/* Menu Organization */}
            <Card className="glass-card border-none card-shadow-xl overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Layout className="h-5 w-5" />
                     </div>
                     <CardTitle>Navigation Layout</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4 font-medium italic">Drag and drop to rearrange homepage menu items.</p>
                  {["MCQ Bank", "Exam Hall", "Lecture Module", "Job Solutions"].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border flex items-center justify-between bg-muted/5 group hover:border-primary transition-all cursor-move">
                       <span className="font-bold flex items-center gap-3">
                          <Badge variant="secondary" className="rounded-md">{i+1}</Badge>
                          {item}
                       </span>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">↑</Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">↓</Button>
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>

         </div>

         <div className="space-y-12">
            
            {/* Database & System */}
            <Card className="glass-card border-none card-shadow-xl overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Database className="h-5 w-5" />
                     </div>
                     <CardTitle>System Maintenance</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
                     <div>
                        <h4 className="font-bold text-destructive flex items-center gap-2">Danger Zone</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Maintenance mode and purge actions</p>
                     </div>
                     <Button variant="destructive" size="sm" className="rounded-full">Enter</Button>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Storage Usage (S3/UploadThing)</Label>
                        <span className="text-xs font-bold">4.2 GB / 10 GB</span>
                     </div>
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[42%] bg-primary" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* API Integration Keys */}
            <Card className="glass-card border-none card-shadow-xl overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                        <Settings className="h-5 w-5" />
                     </div>
                     <CardTitle>External Services</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                     <Label>Contact Mail Hook (Web-to-Lead)</Label>
                     <Input defaultValue="https://api.crm.com/v1/lead" placeholder="Webhook URL" />
                  </div>
                  <div className="space-y-2">
                     <Label>SMS Gateway Key</Label>
                     <Input value="••••••••••••••••" readOnly placeholder="API Key" />
                  </div>
               </CardContent>
            </Card>

         </div>
      </div>
    </div>
  );
}
