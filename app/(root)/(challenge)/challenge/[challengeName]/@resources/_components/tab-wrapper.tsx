import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabWrapperProps = {
  children: ReactNode;
  className?: string;
};

const TabWrapper = ({ children, className }: TabWrapperProps) => {
  return (
    <div
      className={cn(
        "absolute flex h-full w-full flex-col overflow-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default TabWrapper;
