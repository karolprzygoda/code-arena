import { CircleCheckBig } from "lucide-react";
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
          <CircleCheckBig className={"flex-shrink-0 text-emerald-500"} />
        </TooltipTrigger>
        <TooltipContent>Solved</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IsChallengePassedIndicator;
