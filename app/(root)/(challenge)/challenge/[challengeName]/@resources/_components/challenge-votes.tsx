"use client";

import UpVoteButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/up-vote-button";
import DislikeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/down-vote-button";
import VotesStoreProvider from "@/stores/store-providers/votes-store-provider";
import { useLayoutEffect, useState } from "react";
import { getUserVoteType } from "@/actions/utils-actions";
import { Difficulty, Vote } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type ChallengeVotesProps = {
  upVotes: number;
  downVotes: number;
  challengeTitle: string;
  difficulty: Difficulty;
};

const ChallengeVotes = ({
  challengeTitle,
  upVotes,
  downVotes,
  difficulty,
}: ChallengeVotesProps) => {
  const [voteType, setVoteType] = useState<Vote | null>(null);

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    (async () => {
      const { userVote, error } = await getUserVoteType(
        challengeTitle,
        "challengeTitle",
      );

      if (error) {
        toast.error(error);
      } else {
        setVoteType(userVote ? userVote.voteType : null);
      }
      setLoading(false);
    })();
  }, [challengeTitle]);

  const pathsToRevalidate = [
    "/",
    `/challenge/${challengeTitle}`,
    `/update-challenge/${challengeTitle}`,
    `/explore/${difficulty.toLowerCase()}`,
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
      itemId={challengeTitle}
    >
      <UpVoteButton itemType={"challengeTitle"} paths={pathsToRevalidate} />
      <DislikeButton itemType={"challengeTitle"} paths={pathsToRevalidate} />
    </VotesStoreProvider>
  );
};

export default ChallengeVotes;
