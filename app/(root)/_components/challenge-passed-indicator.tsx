"use client";

import { CircleCheckBig } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Submission } from "@prisma/client";
import { useUserContext } from "@/components/user-context-provider";

const hasUserPassedChallenge = (
  submissions: Array<Pick<Submission, "userId" | "challengeId">>,
  userId: string | undefined,
  challengeId: string,
) => {
  return submissions.find(
    (submission) =>
      submission.challengeId === challengeId && submission.userId === userId,
  );
};

type ChallengePassedIndicatorProps = {
  submissions: Array<Pick<Submission, "userId" | "challengeId">>;
  challengeId: string;
};

const ChallengePassedIndicator = ({
  submissions,
  challengeId,
}: ChallengePassedIndicatorProps) => {
  const { user } = useUserContext();

  const isPassed = hasUserPassedChallenge(submissions, user?.id, challengeId);

  if (!isPassed) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label={"Solved"}>
          <CircleCheckBig className={"flex-shrink-0 text-emerald-500"} />
        </TooltipTrigger>
        <TooltipContent>Solved</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChallengePassedIndicator;
