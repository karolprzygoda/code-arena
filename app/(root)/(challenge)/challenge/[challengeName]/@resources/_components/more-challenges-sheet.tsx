import { ChevronRight, Swords } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { Challenge } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import FilteredDataStoreProvider from "@/stores/store-providers/filtered-data-store-provider";
import SheetChallengeCardList from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/sheet-challenge-card-list";
import FilterChallengesButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/filter-challenges-button";

type ChallengeGroupLinkProps = {
  challenges: Array<Pick<Challenge, "title" | "difficulty">>;
};

const MoreChallengesSheet = ({ challenges }: ChallengeGroupLinkProps) => {
  return (
    <Sheet>
      <SheetTrigger
        className={
          "inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md rounded-tl-xl p-2 text-sm font-semibold ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 @[70px]/panel:h-9 @[70px]/panel:justify-start @[70px]/panel:px-3 dark:hover:bg-zinc-900"
        }
      >
        <Swords className={"h-4 w-4 shrink-0"} />
        <span
          className={
            "hidden overflow-hidden text-ellipsis whitespace-nowrap @[70px]/panel:inline"
          }
        >
          More Challenges
        </span>
      </SheetTrigger>
      <SheetContent
        className={"flex !w-[500px] !max-w-full flex-col gap-8 p-0"}
        side={"left"}
      >
        <SheetHeader className={"p-6 pb-0"}>
          <VisuallyHidden>
            <SheetTitle>Explore more challenges</SheetTitle>
            <SheetDescription>Find perfect challenge for ou.</SheetDescription>
          </VisuallyHidden>
          <Link
            href={"/"}
            className={"flex items-center gap-4 text-xl font-semibold"}
          >
            All Challenges
            <ChevronRight />
          </Link>
        </SheetHeader>
        <FilteredDataStoreProvider
          initialData={challenges}
          filters={{ difficulty: "" }}
        >
          <div className={"px-6"}>
            <FilterChallengesButton />
          </div>
          <div className={"flex flex-col p-6 pb-0"}>
            <div
              className={
                "mb-2 flex justify-between text-sm text-muted-foreground"
              }
            >
              <div>Progress</div>
              <div>2/13</div>
            </div>
            <Progress />
          </div>
          <SheetChallengeCardList />
        </FilteredDataStoreProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MoreChallengesSheet;
