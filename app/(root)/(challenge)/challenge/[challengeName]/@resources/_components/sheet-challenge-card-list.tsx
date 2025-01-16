"use client";

import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterChallengesButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/filter-challenges-button";
import { Progress } from "@/components/ui/progress";
import { MoreChallengesSheetType } from "@/lib/types";
import SheetChallengeCard from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/sheet-challenge-card";

import { useSolvedChallengesContext } from "@/components/solved-challenges-context-provider";

const SheetChallengeCardList = () => {
  const challenges = useFilteredDataContext<
    MoreChallengesSheetType[number],
    MoreChallengesSheetType
  >(useShallow((state) => state.data));

  const { solvedChallenges } = useSolvedChallengesContext();

  const userSolvedChallengesByDifficulty = solvedChallenges?.filter(
    (challenge) => challenge.difficulty === challenges[0].difficulty,
  );

  return (
    <>
      <div className={"px-6"}>
        <FilterChallengesButton />
      </div>
      <div className={"flex flex-col p-6 pb-0"}>
        <div
          className={"mb-2 flex justify-between text-sm text-muted-foreground"}
        >
          <div>Progress</div>
          <div>
            {userSolvedChallengesByDifficulty?.length}/{challenges.length}
          </div>
        </div>
        <Progress
          value={
            challenges.length > 0 && userSolvedChallengesByDifficulty
              ? (userSolvedChallengesByDifficulty.length / challenges.length) *
                100
              : 0
          }
        />
      </div>
      <ScrollArea>
        <div className={"flex flex-col gap-2 p-6 pt-0"}>
          {challenges.map((challenge, index) => (
            <SheetChallengeCard
              key={`sheet-challenge-card-${index}`}
              title={challenge.title}
              difficulty={challenge.difficulty}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default SheetChallengeCardList;
