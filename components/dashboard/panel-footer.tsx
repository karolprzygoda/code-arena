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
        "sticky bottom-0 flex items-center justify-between border-t border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-[#1e1e1e]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PanelFooter;
