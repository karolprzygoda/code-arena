"use client";

import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonHTMLAttributes } from "react";

type EditorButtonProps = {
  Icon: LucideIcon;
  tooltipMessage: string;
  tooltipSide?: "top" | "right" | "left" | "bottom";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const EditorButton = ({
  Icon,
  tooltipMessage,
  tooltipSide = "top",
  ...props
}: EditorButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button {...props} className={"h-auto"}>
            <Icon
              className={
                "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
              }
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>
          <p className={"text-sm"}>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EditorButton;
