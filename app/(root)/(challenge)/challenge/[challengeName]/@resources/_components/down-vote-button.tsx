"use client";

import { ThumbsDown } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";

import { cn } from "@/lib/utils";
import useVotesContext from "@/hooks/use-votes-context";
import { useShallow } from "zustand/react/shallow";
import { downVote } from "@/actions/utils-actions";

type DownVoteButtonProps = {
  itemType: "challengeId" | "solutionId";
};

const DownVoteButton = ({ itemType }: DownVoteButtonProps) => {
  const { dislikes, vote, setVote, challengeId } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      dislikes: state.downVotes,
      setVote: state.setVote,
      challengeId: state.itemId,
    })),
  );

  const handleDownVote = async () => {
    setVote("DOWNVOTE");
    await downVote(challengeId!, itemType);
  };

  return (
    <DescriptionActionButton
      tooltipMessage={"Down vote"}
      className={cn(
        vote === "DOWNVOTE" &&
          "bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:border-emerald-600 [&:not(:disabled)]:text-emerald-600",
      )}
      onClick={handleDownVote}
    >
      <ThumbsDown />
      {dislikes}
    </DescriptionActionButton>
  );
};

export default DownVoteButton;
