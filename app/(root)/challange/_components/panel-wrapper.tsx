import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelWrapperProps = {
  children: ReactNode;
  className?: string;
};

const PanelWrapper = ({ children, className }: PanelWrapperProps) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PanelWrapper;
