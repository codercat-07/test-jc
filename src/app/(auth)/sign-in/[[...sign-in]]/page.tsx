import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm px-4 py-12">
      <div className="glass-card p-4 rounded-[40px] shadow-2xl shadow-primary/10 border-none relative overflow-hidden group">
        <SignIn />
        <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      </div>
    </div>
  );
}
