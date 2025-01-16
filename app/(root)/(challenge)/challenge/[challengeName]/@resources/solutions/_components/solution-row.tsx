"use client";

import { Solution, UserRoles, Users } from "@prisma/client";
import SolutionLink from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solution-link";
import { Calendar, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import LanguageBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/language-badge";
import UserProfileLink from "@/components/user-profile-link";

type SolutionRowProps = {
  solution: Solution;
  challengeName: string;
  upVotes: number;
  downVotes: number;
  author: Users & { userRoles: Array<Pick<UserRoles, "role">> };
};

const SolutionRow = ({
  solution,
  challengeName,
  upVotes,
  downVotes,
  author,
}: SolutionRowProps) => {
  return (
    <li>
      <SolutionLink challengeName={challengeName} solutionId={solution.id}>
        <h3 className={"truncate text-start font-bold"}>{solution.title}</h3>
        <div className={"flex flex-wrap items-center gap-4"}>
          <UserProfileLink user={author} />
          <div
            className={
              "text flex items-center gap-1 text-xs text-muted-foreground"
            }
          >
            <Calendar className={"h-4 w-4 shrink-0 text-nowrap"} />
            {formatDistanceToNow(new Date(solution.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className={"flex w-full justify-between"}>
          <LanguageBadge language={solution.language} />
          <div className={"flex gap-2"}>
            <div
              className={
                "inline-flex h-6 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-transparent bg-secondary px-2.5 py-2 text-xs font-medium text-secondary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-700 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              }
            >
              <ThumbsUp />
              {upVotes}
            </div>
            <div
              className={
                "inline-flex h-6 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-transparent bg-secondary px-2.5 py-2 text-xs font-medium text-secondary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-700 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              }
            >
              <ThumbsDown />
              {downVotes}
            </div>
          </div>
        </div>
      </SolutionLink>
    </li>
  );
};

export default SolutionRow;
