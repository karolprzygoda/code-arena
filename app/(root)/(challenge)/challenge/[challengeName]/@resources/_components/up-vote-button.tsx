"use client";

import { ThumbsUp } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import useVotesContext from "@/hooks/use-votes-context";
import { upVote } from "@/actions/utils-actions";

type UpVoteButtonProps = {
  itemType: "challengeId" | "solutionId";
};

const UpVoteButton = ({ itemType }: UpVoteButtonProps) => {
  const { likes, vote, setVote, challengeId } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      likes: state.upVotes,
      setVote: state.setVote,
      challengeId: state.itemId,
    })),
  );

  const handleUpVote = async () => {
    setVote("UPVOTE");
    await upVote(challengeId!, itemType);
  };

  return (
    <DescriptionActionButton
      tooltipMessage={"Up vote"}
      className={cn(
        vote === "UPVOTE" &&
          "bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:border-emerald-600 [&:not(:disabled)]:text-emerald-600",
      )}
      onClick={handleUpVote}
    >
      <ThumbsUp />
      {likes}
    </DescriptionActionButton>
  );
};

export default UpVoteButton;
