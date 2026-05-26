import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-12">
        <Skeleton className="h-6 w-40 mb-4 bg-white/5" />
        <Skeleton className="h-14 w-96 mb-3 bg-white/5" />
        <Skeleton className="h-5 w-72 mb-6 bg-white/5" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl bg-white/5" />
          <Skeleton className="h-10 w-28 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4">
        <Skeleton className="h-6 w-32 mb-4 bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
