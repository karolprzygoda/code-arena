"use client";

import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Solution } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";
import NotFoundComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/not-found-component";
import SolutionRow from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solution-row";

type SolutionsWrapperProps = {
  challengeName: string;
};

const SolutionsWrapper = ({ challengeName }: SolutionsWrapperProps) => {
  const solution = useFilteredDataContext<
    Solution & {
      upVotes: number;
      downVotes: number;
      author: {
        id: string;
        email: string;
        profileImageSrc: string | null;
        isAdmin: boolean;
      };
    },
    Array<
      Solution & {
        upVotes: number;
        downVotes: number;
        author: {
          id: string;
          email: string;
          profileImageSrc: string | null;
          isAdmin: boolean;
        };
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
      {solution.map((solution) => (
        <SolutionRow
          upVotes={solution.upVotes}
          downVotes={solution.downVotes}
          challengeName={challengeName}
          author={solution.author}
          key={`submission-${solution.id}`}
          solution={solution}
        />
      ))}
    </ul>
  );
};

export default SolutionsWrapper;
