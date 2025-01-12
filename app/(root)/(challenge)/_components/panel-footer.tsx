import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelFooterProps = {
  children: ReactNode;
  className?: string;
};

const PanelFooter = ({ children, className }: PanelFooterProps) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-50 flex items-center justify-between border-t border-zinc-300 px-3 py-2 dark:border-zinc-700",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PanelFooter;
