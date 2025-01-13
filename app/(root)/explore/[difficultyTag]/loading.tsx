import { Skeleton } from "@/components/ui/skeleton";
import ChallengeCardSkeleton from "@/app/(root)/_components/challenge-card-skeleton";

const Loading = () => {
  return (
    <div
      className={
        "container flex flex-col items-center gap-8 py-5 md:gap-16 md:pb-20"
      }
    >
      <Skeleton className={"h-10 w-32 rounded-2xl"} />
      <div className={"flex w-full flex-wrap justify-center gap-6"}>
        {Array.from({ length: 5 }).map((_, index) => (
          <ChallengeCardSkeleton key={`card-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
