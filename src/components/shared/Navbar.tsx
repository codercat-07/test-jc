import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Search, Bell, Menu } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default async function Navbar() {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  // Fetch menu config from SiteSettings
  const menuConfig = await prisma.siteSettings.findUnique({
    where: { key: "menu_config" },
  });

  const links = (menuConfig?.value as any[])?.filter((l) => l.isVisible) || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-all">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
              BD-LMS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="transition-colors hover:text-primary relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                className="text-primary font-semibold hover:opacity-80"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
              0
            </Badge>
          </Button>

          <div className="ml-2">
            {userId ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 rounded-full",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="rounded-full font-medium">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card border-none">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-2xl">BD-LMS</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {userId && (
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      My Dashboard
                    </Link>
                  )}
                  {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <Link
                      href="/admin"
                      className="text-lg font-bold text-primary"
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
