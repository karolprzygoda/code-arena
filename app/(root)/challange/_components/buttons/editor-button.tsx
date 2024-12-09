"use client";

import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type EditorButtonProps = {
  Icon: LucideIcon;
  tooltipMessage: string;
  tooltipSide?: "top" | "right" | "left" | "bottom";
  label?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const EditorButton = ({
  Icon,
  tooltipMessage,
  tooltipSide = "top",
  label,
  ...props
}: EditorButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            {...props}
            className={cn("flex h-auto items-center gap-2", props.className)}
          >
            <Icon
              className={
                "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
              }
            />
            {label}
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
