import { ResizablePanel } from "@/components/ui/resizable";
import { ReactNode } from "react";

type TestsPanelProps = {
  children: ReactNode;
};

const TestsPanel = ({ children }: TestsPanelProps) => {
  return (
    <ResizablePanel id={"test-panel"} defaultSize={0}>
      <div className="h-full overflow-y-auto p-3 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        {children}
      </div>
    </ResizablePanel>
  );
};

export default TestsPanel;
