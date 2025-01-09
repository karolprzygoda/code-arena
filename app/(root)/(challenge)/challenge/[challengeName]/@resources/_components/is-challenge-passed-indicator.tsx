import { CircleCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const IsChallengePassedIndicator = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CircleCheck className={"flex-shrink-0 text-green-500"} />
        </TooltipTrigger>
        <TooltipContent>Solved</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IsChallengePassedIndicator;
