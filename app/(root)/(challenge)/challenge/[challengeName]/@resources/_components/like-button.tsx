"use client";

import { ThumbsUp } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import useVotesContext from "@/hooks/use-votes-context";
import { upVoteChallenge } from "@/actions/actions";

type LikeButtonProps = {
  challengeId: string;
};

const LikeButton = ({ challengeId }: LikeButtonProps) => {
  const { likes, vote, setVote } = useVotesContext(
    useShallow((state) => ({
      vote: state.vote,
      likes: state.likes,
      setVote: state.setVote,
    })),
  );

  const handleUpVote = async () => {
    setVote("LIKE");
    await upVoteChallenge(challengeId);
  };

  return (
    <DescriptionActionButton
      className={cn(
        vote === "LIKE" &&
          "bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:border-emerald-600 [&:not(:disabled)]:text-emerald-600",
      )}
      onClick={handleUpVote}
    >
      <ThumbsUp />
      {likes}
    </DescriptionActionButton>
  );
};

export default LikeButton;
