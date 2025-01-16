import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import ChallengePassedIndicator from "@/app/(root)/_components/challenge-passed-indicator";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { TChallengeCard } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn, createUserName } from "@/lib/utils";
import { Submission } from "@prisma/client";
import ManageChallengeButton from "@/app/(root)/_components/manage-challenge-button";

type ChallengeCardProps = {
  challenge: TChallengeCard;
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

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const title = challenge.title
    .split("-")
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

  const downVotes = challenge.votes.filter(
    (vote) => vote.voteType === "DOWNVOTE",
  ).length;

  const upVotes = challenge.votes.filter(
    (vote) => vote.voteType === "UPVOTE",
  ).length;

  const userName = createUserName(challenge.users.email!);

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
          <div className={"flex w-full items-center justify-between"}>
            <h3
              className={
                "max-w-[75%] truncate text-2xl font-semibold tracking-tight duration-300"
              }
            >
              {title}
            </h3>
            <ManageChallengeButton
              blur={false}
              challengeId={challenge.id}
              challengeTitle={challenge.title}
            />
          </div>
          <div className={"flex min-h-6 items-center gap-5 text-center"}>
            <DifficultyBadge difficulty={challenge.difficulty} />

            <div className={"flex items-center gap-2 text-sm"}>
              <ThumbsUp className={"h-4 w-4"} />
              {upVotes}
            </div>
            <div className={"flex items-center gap-2 text-sm"}>
              <ThumbsDown className={"h-4 w-4"} />
              {downVotes}
            </div>
            <ChallengePassedIndicator
              submissions={challenge.submission as Submission[]}
              challengeId={challenge.id}
            />
          </div>
        </CardHeader>
        <CardContent className={"relative flex flex-col gap-2 pb-0 pt-1"}>
          <div className={"flex flex-wrap items-center gap-2 sm:flex-nowrap"}>
            <div
              className={
                "max-w-1/3 overflow-hidden text-ellipsis text-xs font-semibold"
              }
            >
              {userName}
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
