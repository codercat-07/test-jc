import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Access Denied</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          You do not have permission to access this area. If you believe this is a mistake, please contact support.
        </p>
      </div>
      <Button asChild size="lg" className="mt-4">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
