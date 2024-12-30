"use client";

import { ThumbsDown } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";

import { cn } from "@/lib/utils";
import useVotesContext from "@/hooks/use-votes-context";
import { useShallow } from "zustand/react/shallow";
import { downVoteChallenge } from "@/actions/actions";

type DisLikeButtonProps = {
  challengeId: string;
};

const DisLikeButton = ({ challengeId }: DisLikeButtonProps) => {
  const { dislikes, vote, setVote } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      dislikes: state.dislikes,
      setVote: state.setVote,
    })),
  );

  const handleDownVote = async () => {
    setVote("DISLIKE");
    await downVoteChallenge(challengeId);
  };

  return (
    <DescriptionActionButton
      className={cn(
        vote === "DISLIKE" &&
          "bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:border-emerald-600 [&:not(:disabled)]:text-emerald-600",
      )}
      onClick={handleDownVote}
    >
      <ThumbsDown />
      {dislikes}
    </DescriptionActionButton>
  );
};

export default DisLikeButton;
