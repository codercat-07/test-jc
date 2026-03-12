'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Something went wrong!</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          {error.message || "An unexpected error occurred. We've been notified about this issue."}
        </p>
      </div>
      <Button onClick={() => reset()} size="lg" className="mt-4">
        Try again
      </Button>
    </div>
  );
}
