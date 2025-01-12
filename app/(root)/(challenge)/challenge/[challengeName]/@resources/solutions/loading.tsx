import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className={"flex h-full w-full flex-col"}>
      <div
        className={
          "flex w-full flex-wrap gap-4 border-b border-zinc-300 px-4 py-2 dark:border-zinc-700"
        }
      >
        <Skeleton className="h-6 w-48 rounded-2xl" />
        <Skeleton className="h-6 w-48 rounded-2xl" />
      </div>
      <ul
        className={
          "*:border-b *:border-zinc-300 last:*:border-0 *:dark:border-zinc-700"
        }
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            className={"flex flex-col gap-2 p-4"}
            key={`solution-skeleton-${i}`}
          >
            <Skeleton className={"h-6 w-52 rounded-full"} />
            <div className={"flex flex-wrap items-center gap-4"}>
              {/*<UserProfileLink userId={solution.authorId} />*/}
              <Skeleton className={"h-4 w-32 rounded-full"} />
            </div>
            <div className={"flex w-full justify-between"}>
              <Skeleton className={"h-6 w-20 rounded-full"} />
              <div className={"flex gap-2"}>
                <Skeleton className={"h-6 w-10 rounded-full"} />
                <Skeleton className={"h-6 w-10 rounded-full"} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loading;
