"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DescriptionActionButtonProps = {
  children: ReactNode;
  tooltipMessage: string;
  className?: string;
} & ButtonProps;

const DescriptionActionButton = ({
  children,
  tooltipMessage,
  className,
  ...props
}: DescriptionActionButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            className={cn(
              "h-6 gap-2 rounded-2xl border border-transparent bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:hover:border-emerald-600 [&:not(:disabled)]:hover:text-emerald-600",
              className,
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipMessage}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DescriptionActionButton;
