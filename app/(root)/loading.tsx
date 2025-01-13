import { Skeleton } from "@/components/ui/skeleton";
import ChallengeCardSkeleton from "@/app/(root)/_components/challenge-card-skeleton";

export default function Loading() {
  return (
    <div className="overflow-hidden p-4 text-white">
      {/* Hero Section */}
      <div className="mb-16 space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-32" />
        <Skeleton className="mx-auto h-4 w-[600px] max-w-full" />
        <Skeleton className="mx-auto h-4 w-[400px] max-w-full" />
      </div>

      {/* Challenges Section */}
      <div className="mb-16 space-y-6 overflow-hidden">
        <div className="container flex items-center justify-between gap-3 px-4 pt-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="hidden h-8 w-24 rounded-full md:block" />
        </div>
        <div className="carousel home-cards-container flex gap-4 px-4 md:px-24">
          {[...Array(5)].map((_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Challenges Section */}
      <div className="mb-16 space-y-6 overflow-hidden">
        <div className="container flex items-center justify-between gap-3 px-4 pt-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="hidden h-8 w-24 rounded-full md:block" />
        </div>
        <div className="carousel home-cards-container flex gap-4 px-4 md:px-24">
          {[...Array(5)].map((_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
