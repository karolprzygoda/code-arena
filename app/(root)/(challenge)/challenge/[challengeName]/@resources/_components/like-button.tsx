import { ThumbsUp } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";

const LikeButton = () => {
  return (
    <DescriptionActionButton>
      <ThumbsUp />
      62
    </DescriptionActionButton>
  );
};

export default LikeButton;
