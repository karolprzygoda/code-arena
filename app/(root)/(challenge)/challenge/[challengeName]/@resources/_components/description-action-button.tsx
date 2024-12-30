"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

type DescriptionActionButtonProps = {
  children: ReactNode;
} & ButtonProps;

const DescriptionActionButton = ({
  children,
  ...props
}: DescriptionActionButtonProps) => {
  return (
    <Button
      {...props}
      className={
        "h-6 gap-2 rounded-2xl border border-transparent bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-zinc-700 dark:hover:bg-zinc-900 [&:not(:disabled)]:hover:border-emerald-600 [&:not(:disabled)]:hover:text-emerald-600"
      }
    >
      {children}
    </Button>
  );
};

export default DescriptionActionButton;
