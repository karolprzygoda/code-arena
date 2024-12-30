import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelHeaderProps = {
  children: ReactNode;
  className?: string;
};

const PanelHeader = ({ children, className }: PanelHeaderProps) => {
  return (
    <div
      className={cn(
        "sticky top-0 flex h-[44px] min-h-[44px] items-center justify-between gap-1 border-b border-zinc-300 px-3 py-1 dark:border-zinc-700",
        className,
      )}
    >
      {children}
    </div>
  );
};
export default PanelHeader;
