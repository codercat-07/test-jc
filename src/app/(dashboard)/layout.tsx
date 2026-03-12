import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // NOTE: Sidebar will be added here in Section 11B
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
