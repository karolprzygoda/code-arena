import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelWrapperProps = {
  children: ReactNode;
  className?: string;
};

const RootPanelWrapper = ({ children, className }: PanelWrapperProps) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-y-hidden rounded-2xl border border-zinc-300 dark:border-zinc-700",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default RootPanelWrapper;
