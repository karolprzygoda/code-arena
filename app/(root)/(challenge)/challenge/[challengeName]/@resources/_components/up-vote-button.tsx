"use client";

import { ThumbsUp } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { upVote } from "@/actions/utils-actions";
import useVotesContext from "@/hooks/use-votes-context";
import { VotableItems } from "@/lib/types";
import { toast } from "sonner";

type UpVoteButtonProps = {
  itemType: VotableItems;
  paths?: string[];
};

const UpVoteButton = ({ itemType, paths }: UpVoteButtonProps) => {
  const { upVotes, vote, setVote, itemId } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      upVotes: state.upVotes,
      setVote: state.setVote,
      itemId: state.itemId,
    })),
  );

  const handleUpVote = async () => {
    setVote("UPVOTE");
    const { error } = await upVote(itemId!, itemType, paths);
    if (error) {
      toast.error(error);
    }
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
      {upVotes}
    </DescriptionActionButton>
  );
};

export default UpVoteButton;
