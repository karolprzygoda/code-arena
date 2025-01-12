import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className={"flex h-full w-full flex-col gap-4 p-4"}>
      <div className={"flex gap-2"}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={`header-skeleton-${i}`}
            className="h-6 w-48 rounded-2xl"
          />
        ))}
      </div>
      <div className="flex h-full flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={`submission-row-skeleton-${i}`}
            className="h-14 w-full rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
