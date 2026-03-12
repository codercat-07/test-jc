import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Search className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">404 - Page Not Found</h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
      </div>
      <Button asChild size="lg" className="mt-4">
        <Link href="/">Back to Homepage</Link>
      </Button>
    </div>
  );
}
