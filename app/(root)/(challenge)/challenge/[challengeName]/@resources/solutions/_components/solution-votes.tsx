"use client";

import UpVoteButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/up-vote-button";
import DislikeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/down-vote-button";
import VotesStoreProvider from "@/stores/store-providers/votes-store-provider";
import { useLayoutEffect, useState } from "react";
import { getUserVoteType } from "@/actions/utils-actions";
import { Vote } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type SolutionVotesProps = {
  upVotes: number;
  downVotes: number;
  solutionId: string;
  challengeTitle: string;
};

const SolutionVotes = ({
  solutionId,
  upVotes,
  downVotes,
  challengeTitle,
}: SolutionVotesProps) => {
  const [voteType, setVoteType] = useState<Vote | null>(null);

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    (async () => {
      const { userVote, error } = await getUserVoteType(
        solutionId,
        "solutionId",
      );

      if (error) {
        toast.error(error);
      } else {
        setVoteType(userVote ? userVote.voteType : null);
      }

      setLoading(false);
    })();
  }, [solutionId]);

  const pathsToRevalidate = [
    `/challenge/${challengeTitle}/solutions/${solutionId}`,
    `/challenge/${challengeTitle}/solutions`,
  ];

  if (loading) {
    return (
      <>
        <Skeleton className={"h-6 w-[53px] rounded-full"} />
        <Skeleton className={"h-6 w-[53px] rounded-full"} />
      </>
    );
  }

  return (
    <VotesStoreProvider
      vote={voteType}
      upVotes={upVotes}
      downVotes={downVotes}
      itemId={solutionId}
    >
      <UpVoteButton itemType={"solutionId"} paths={pathsToRevalidate} />
      <DislikeButton itemType={"solutionId"} paths={pathsToRevalidate} />
    </VotesStoreProvider>
  );
};

export default SolutionVotes;
