"use client";

import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Solution, UserRoles, Users, Votes } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";
import NotFoundComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/not-found-component";
import SolutionRow from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solution-row";

type SolutionsListProps = {
  challengeName: string;
};

const SolutionsList = ({ challengeName }: SolutionsListProps) => {
  const solution = useFilteredDataContext<
    Solution & {
      votes: Array<Pick<Votes, "voteType">>;
      users: Users & { userRoles: Array<Pick<UserRoles, "role">> };
    },
    Array<
      Solution & {
        votes: Array<Pick<Votes, "voteType">>;
        users: Users & { userRoles: Array<Pick<UserRoles, "role">> };
      }
    >
  >(useShallow((state) => state.data));

  if (solution.length < 1) {
    return (
      <div className={"flex h-full flex-col"}>
        <NotFoundComponent />
      </div>
    );
  }

  return (
    <ul
      className={
        "*:border-b *:border-zinc-300 last:*:border-0 *:dark:border-zinc-700"
      }
    >
      {solution.map((solution) => {
        return (
          <SolutionRow
            upVotes={
              solution.votes.filter((vote) => vote.voteType === "UPVOTE").length
            }
            downVotes={
              solution.votes.filter((vote) => vote.voteType === "DOWNVOTE")
                .length
            }
            challengeName={challengeName}
            author={solution.users}
            key={`submission-${solution.id}`}
            solution={solution}
          />
        );
      })}
    </ul>
  );
};

export default SolutionsList;
