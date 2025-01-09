import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className={"h-full w-full p-4"}>
      <div className={"mb-8 flex w-full flex-col gap-2 @[486px]/panel:w-1/2"}>
        <Skeleton className="h-[36px] w-full rounded-xl" />
        <div className={"flex gap-2"}>
          <Skeleton className="h-[20px] w-1/2 rounded-xl" />
          <Skeleton className="h-[20px] w-1/2 rounded-xl" />
        </div>
        <div className={"grid w-1/2 grid-cols-4 gap-1"}>
          <Skeleton className="h-[25px] rounded-xl" />
          <Skeleton className="h-[25px] rounded-xl" />
          <Skeleton className="h-[25px] rounded-xl" />
          <Skeleton className="h-[25px] rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-3/4 w-full rounded-xl" />
    </div>
  );
};

export default Loading;
