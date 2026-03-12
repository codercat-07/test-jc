import { prisma } from "@/lib/prisma";
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
import { 
  Search, 
  UserCog, 
  ShieldCheck, 
  ShieldAlert,
  MoreVertical,
  Mail,
  Smartphone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight leading-none uppercase italic text-primary">User Management</h1>
           <p className="text-muted-foreground mt-2 font-medium">Oversee accounts and assign administrative roles.</p>
        </div>
        
        <div className="flex bg-muted/20 p-1 rounded-full border border-border/50 max-w-md w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name or email..." className="bg-transparent border-none rounded-full h-12 pl-12 focus-visible:ring-0" />
           </div>
           <Button className="rounded-full px-8 h-12 shadow-lg">Filter</Button>
        </div>
      </div>

      <div className="glass-card border-none card-shadow-xl rounded-[40px] overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest">User</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Role</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Joined</TableHead>
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} className="hover:bg-primary/5 transition-colors border-border/50 group">
                <TableCell className="py-6 px-8">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl border-2 border-primary/20 p-0.5">
                         <img src={user.avatar || ""} className="h-full w-full rounded-2xl object-cover" alt={user.name} />
                      </div>
                      <div>
                         <span className="font-bold text-lg tracking-tight block">{user.name}</span>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase"><Mail className="h-2.5 w-2.5" /> {user.email}</span>
                            {user.phone && <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase border-l pl-3"><Smartphone className="h-2.5 w-2.5" /> {user.phone}</span>}
                         </div>
                      </div>
                   </div>
                </TableCell>
                <TableCell className="py-6">
                  <Badge variant="outline" className={cn(
                    "rounded-lg px-3 py-1 font-black uppercase text-[10px]",
                    user.role === "SUPER_ADMIN" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    user.role === "ADMIN" ? "bg-primary/10 text-primary border-primary/20" :
                    user.role === "INSTRUCTOR" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-muted/30 text-muted-foreground"
                  )}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-6 text-center">
                  <Badge className={cn("rounded-full h-2 w-2 p-0 animate-pulse", user.isActive ? "bg-success" : "bg-destructive")} />
                </TableCell>
                <TableCell className="py-6 text-center text-muted-foreground font-medium text-xs">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell className="py-6 px-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-muted">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-none shadow-2xl">
                       <DropdownMenuItem className="rounded-xl gap-3 py-3 font-bold group cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <UserCog className="h-4 w-4 opacity-50 group-hover:opacity-100" /> View Profile
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-xl gap-3 py-3 font-bold group cursor-pointer focus:bg-success/5 focus:text-success">
                          <ShieldCheck className="h-4 w-4 opacity-50 group-hover:opacity-100" /> Elevate to Instructor
                       </DropdownMenuItem>
                       <DropdownMenuItem className="rounded-xl gap-3 py-3 font-bold group cursor-pointer focus:bg-destructive/5 focus:text-destructive">
                          <ShieldAlert className="h-4 w-4 opacity-50 group-hover:opacity-100" /> Suspend Account
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}
