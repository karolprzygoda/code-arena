"use client";

import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";
import { ChevronDown, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTestsPanelStore } from "@/stores/tests-panel-store";
import { useTestResultsStore } from "@/stores/tests-results-store";

const ExpandTestsPanelButton = () => {
  const { testsResizablePanel, isCollapsed } = useTestsPanelStore(
    useShallow((state) => ({
      testsResizablePanel: state.testsResizablePanel,
      isCollapsed: state.isCollapsed,
    })),
  );

  const { testResults } = useTestResultsStore(
    useShallow((state) => ({
      testResults: state.testsResults,
    })),
  );

  const handleTogglePanelResize = () => {
    if (testsResizablePanel) {
      if (isCollapsed) {
        testsResizablePanel.expand();
      } else {
        testsResizablePanel.collapse();
      }
    }
  };

  return (
    <Button
      className={"gap-1 rounded-xl font-bold"}
      variant={"ghost"}
      onClick={handleTogglePanelResize}
    >
      <ChevronDown
        className={cn("transition-transform", !isCollapsed && "rotate-180")}
      />
      <span className={"mr-3"}>Tests</span>
      {testResults.length > 0 &&
        (testResults.every((testResults) => testResults.passed) ? (
          <CircleCheck className={"text-green-500"} />
        ) : (
          <CircleX className={"text-red-500"} />
        ))}
    </Button>
  );
};

export default ExpandTestsPanelButton;
