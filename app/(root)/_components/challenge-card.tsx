import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import IsChallengePassedIndicator from "@/app/(root)/_components/is-challenge-passed-indicator";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ChallengeCardType } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Submission } from "@prisma/client";

type ChallengeCardProps = {
  signedInUser: User;
  challenge: ChallengeCardType;
};

const BORDERS_BY_DIFFICULTY = {
  BEGINNER:
    "dark:hover:border-difficulty-beginner-dark hover:border-difficulty-beginner dark:group-focus:border-difficulty-beginner-dark group-focus:border-difficulty-beginner",
  EASY: "dark:hover:border-difficulty-easy-dark hover:border-difficulty-easy dark:group-focus:border-difficulty-easy-dark group-focus:border-difficulty-easy",
  MEDIUM:
    "dark:hover:border-difficulty-medium-dark hover:border-difficulty-medium dark:group-focus:border-difficulty-medium-dark group-focus:border-difficulty-medium",
  HARD: "dark:hover:border-difficulty-hard-dark hover:border-difficulty-hard dark:group-focus:border-difficulty-hard-dark group-focus:border-difficulty-hard",
  EXTREME:
    "dark:hover:border-difficulty-extreme-dark hover:border-difficulty-extreme dark:group-focus:border-difficulty-extreme-dark group-focus:border-difficulty-extreme",
};

const SHADOWS_BY_DIFFICULTY = {
  BEGINNER:
    "hover:shadow-beginner group-focus:shadow-beginner dark:hover:shadow-beginner-dark dark:group-focus:shadow-beginner-dark",
  EASY: "hover:shadow-easy group-focus:shadow-easy dark:hover:shadow-easy-dark dark:group-focus:shadow-easy-dark",
  MEDIUM:
    "hover:shadow-medium group-focus:shadow-medium dark:hover:shadow-medium-dark dark:group-focus:shadow-medium-dark",
  HARD: "hover:shadow-hard group-focus:shadow-hard dark:hover:shadow-hard-dark dark:group-focus:shadow-hard-dark",
  EXTREME:
    "hover:shadow-extreme group-focus:shadow-extreme dark:hover:shadow-extreme-dark dark:group-focus:shadow-extreme-dark",
};

const hasUserPassedChallenge = (
  successSubmissions: Submission[],
  userId: string,
  challengeId: string,
) => {
  return successSubmissions.find(
    (submission) =>
      submission.challengeId === challengeId && submission.userId === userId,
  );
};

const ChallengeCard = ({ challenge, signedInUser }: ChallengeCardProps) => {
  const isPassed = hasUserPassedChallenge(
    challenge.submission as Submission[],
    signedInUser.id,
    challenge.id,
  );

  return (
    <Link
      href={`/challenge/${challenge.title}`}
      className={
        "group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
      }
    >
      <Card
        className={cn(
          `group/card relative overflow-hidden rounded-3xl bg-background duration-300 hover:bg-card-hovered sm:min-w-[300px] xl:min-w-[333px]`,
          SHADOWS_BY_DIFFICULTY[challenge.difficulty],
          BORDERS_BY_DIFFICULTY[challenge.difficulty],
        )}
      >
        <CardHeader className={"gap-1"}>
          <h3
            className={
              "max-w-[75%] truncate text-2xl font-semibold tracking-tight duration-300"
            }
          >
            {challenge.title}
          </h3>
          <div className={"flex items-center gap-5 text-center"}>
            <DifficultyBadge difficulty={challenge.difficulty} />
            {isPassed && <IsChallengePassedIndicator />}
            <div className={"flex items-center gap-2 text-sm"}>
              <ThumbsUp className={"h-4 w-4"} />
              {
                challenge.votes.filter((vote) => vote.voteType === "UPVOTE")
                  .length
              }
            </div>
            <div className={"flex items-center gap-2 text-sm"}>
              <ThumbsDown className={"h-4 w-4"} />
              {
                challenge.votes.filter((vote) => vote.voteType === "DOWNVOTE")
                  .length
              }
            </div>
          </div>
        </CardHeader>
        <CardContent className={"relative flex flex-col gap-2 pb-0 pt-1"}>
          <div className={"flex flex-wrap items-center gap-2 sm:flex-nowrap"}>
            <div
              className={
                "max-w-1/3 overflow-hidden text-ellipsis text-xs font-semibold"
              }
            >
              {challenge.users.email}
            </div>
            <div className={"whitespace-nowrap text-sm text-muted-foreground"}>
              Created{" "}
              {formatDistanceToNow(new Date(challenge.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div
            className={
              "relative h-20 pb-4 text-sm leading-[1.425rem] text-muted-foreground"
            }
          >
            <p className={"mb-4 line-clamp-3 overflow-hidden text-ellipsis"}>
              {challenge.descriptionSnippet}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChallengeCard;
