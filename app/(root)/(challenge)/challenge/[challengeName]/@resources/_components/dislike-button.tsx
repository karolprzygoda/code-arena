import { ThumbsDown } from "lucide-react";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";

const DisLikeButton = () => {
  return (
    <DescriptionActionButton>
      <ThumbsDown />
      62
    </DescriptionActionButton>
  );
};

export default DisLikeButton;
