import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ChallengeCardSkeleton = () => {
  return (
    <Card
      className={
        "group/card relative min-w-[300px] overflow-hidden rounded-3xl bg-background duration-300 xl:min-w-[333px]"
      }
    >
      <CardHeader className={"gap-1"}>
        <Skeleton className="h-6 w-32" />
        <div className={"flex items-center gap-2"}>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className={"relative flex flex-col gap-2 pt-1"}>
        <div className={"flex gap-2"}>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCardSkeleton;
