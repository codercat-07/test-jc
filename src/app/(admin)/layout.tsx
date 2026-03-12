import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    redirect(signInUrl.toString());
  }

  const role = sessionClaims?.metadata?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/5">
        <div className="p-10">
           {children}
        </div>
      </main>
    </div>
  );
}
