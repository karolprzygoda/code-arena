"use client";

import { Difficulty } from "@prisma/client";
import { CircleCheckBig } from "lucide-react";
import { useSolvedChallengesContext } from "@/components/solved-challenges-context-provider";
import { Skeleton } from "@/components/ui/skeleton";

type UserChallengesResultsProps = {
  difficultyTag: Difficulty;
  numberOfAllChallenges: number;
};

const UserChallengesResults = ({
  difficultyTag,
  numberOfAllChallenges,
}: UserChallengesResultsProps) => {
  const { solvedChallenges } = useSolvedChallengesContext();

  const numberOfSolvedChallenges = solvedChallenges?.filter(
    (challenge) => challenge.difficulty === difficultyTag,
  ).length;

  if (numberOfSolvedChallenges === undefined) {
    return <Skeleton className="hidden h-8 w-24 rounded-full md:block" />;
  }

  return (
    <div className={"flex items-center gap-1"}>
      {numberOfSolvedChallenges === numberOfAllChallenges && (
        <CircleCheckBig className={"flex-shrink-0 text-emerald-500"} />
      )}
      <span className={"text-sm text-muted-foreground"}>
        {`${numberOfSolvedChallenges} / ${numberOfAllChallenges} Solved`}
      </span>
    </div>
  );
};

export default UserChallengesResults;
