"use client";

import { ThumbsDown } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { downVote } from "@/actions/utils-actions";
import useVotesContext from "@/hooks/use-votes-context";
import { VotableItems } from "@/lib/types";
import { toast } from "sonner";

type DownVoteButtonProps = {
  itemType: VotableItems;
  paths?: string[];
};

const DownVoteButton = ({ itemType, paths }: DownVoteButtonProps) => {
  const { downVotes, vote, setVote, itemId } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      downVotes: state.downVotes,
      setVote: state.setVote,
      itemId: state.itemId,
    })),
  );

  const handleDownVote = async () => {
    setVote("DOWNVOTE");
    const { error } = await downVote(itemId!, itemType, paths);
    if (error) {
      toast.error(error);
    }
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
      {downVotes}
    </DescriptionActionButton>
  );
};

export default DownVoteButton;
