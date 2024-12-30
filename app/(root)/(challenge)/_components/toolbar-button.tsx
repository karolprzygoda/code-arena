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

type ToolbarButtonProps = {
  Icon: LucideIcon;
  tooltipMessage: string;
  tooltipSide?: "top" | "right" | "left" | "bottom";
  iconWidth?: 1 | 2;
  label?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ToolbarButton = ({
  Icon,
  tooltipMessage,
  tooltipSide = "top",
  label,
  iconWidth = 1,
  ...props
}: ToolbarButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            {...props}
            className={cn("flex h-auto items-center gap-2", props.className)}
          >
            <Icon
              className={cn(
                "h-5 w-5 stroke-zinc-500 hover:stroke-zinc-400",
                iconWidth === 1 ? "stroke-1" : "stroke-2",
              )}
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

export default ToolbarButton;
