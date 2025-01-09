import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className={"absolute h-full w-full"}>
      <div
        className={
          "flex w-full border-b border-zinc-300 px-4 py-2 text-sm font-semibold text-muted-foreground dark:border-zinc-700"
        }
      >
        <Skeleton className={"h-5 w-40 rounded-xl"} />
      </div>
      <div className="mx-auto max-w-[700px] space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        {/* Graph skeleton */}
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="flex h-48 items-end gap-1">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-4"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between px-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
