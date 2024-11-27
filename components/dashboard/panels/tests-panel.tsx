import { ResizablePanel } from "@/components/ui/resizable";
import { ReactNode } from "react";

type TestsPanelProps = {
  children: ReactNode;
};

const TestsPanel = ({ children }: TestsPanelProps) => {
  return (
    <ResizablePanel defaultSize={0}>
      <div className="flex h-full items-center justify-center p-6 dark:bg-[#1e1e1e]">
        {children}
      </div>
    </ResizablePanel>
  );
};

export default TestsPanel;
