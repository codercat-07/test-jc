import { Suspense } from "react";
import HeroBanner from "@/components/shared/HeroBanner";
import StatsBar from "@/components/shared/StatsBar";
import FeatureCards from "@/components/shared/FeatureCards";
import RecentContentStrips from "@/components/shared/RecentContentStrips";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      
      <Suspense fallback={<StatsSkeleton />}>
        <StatsBar />
      </Suspense>

      <FeatureCards />

      <Suspense fallback={<ContentSkeleton />}>
        <RecentContentStrips />
      </Suspense>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="container py-8 px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="container py-12 px-4 space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
