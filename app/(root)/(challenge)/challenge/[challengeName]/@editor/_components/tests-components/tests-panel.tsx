"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { useShallow } from "zustand/react/shallow";
import { Icons } from "@/components/icons";
import TestTracker from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/test-tracker";
import { TestAccordion } from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/test-accordion";
import TestItem from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/test-item";
import useEditorContext from "@/hooks/use-editor-context";
import { useEffect, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useTestsPanelStore } from "@/stores/tests-panel-store";

type TestsPanelProps = {
  tests: PrismaJson.TestCasesType;
};

const TestsPanel = ({ tests }: TestsPanelProps) => {
  const { testsResults, globalError } = useTestResultsStore(
    useShallow((state) => ({
      testsResults: state.testsResults,
      globalError: state.globalError,
    })),
  );

  const testsPanelRef = useRef<ImperativePanelHandle>(null);

  const { isPending } = useEditorContext(
    useShallow((state) => ({
      isPending: state.isPending,
    })),
  );

  const { setTestsResizablePanel, setIsCollapsed } = useTestsPanelStore(
    useShallow((state) => ({
      setTestsResizablePanel: state.setTestsResizablePanel,
      setIsCollapsed: state.setIsCollapsed,
    })),
  );

  useEffect(() => {
    if (testsPanelRef.current) {
      setTestsResizablePanel(testsPanelRef.current);
    }
  }, [setTestsResizablePanel, testsPanelRef]);

  if (isPending) {
    return (
      <ResizablePanel id={"test-panel"} defaultSize={30}>
        <div className="flex h-full items-center justify-center">
          <Icons.loadingSpinner />
        </div>
      </ResizablePanel>
    );
  }

  return (
    <ResizablePanel
      onCollapse={() => setIsCollapsed(true)}
      onExpand={() => setIsCollapsed(false)}
      collapsible
      minSize={20}
      ref={testsPanelRef}
      id="test-panel"
      defaultSize={30}
    >
      <div className="h-full overflow-y-auto p-3 dark:border-zinc-700">
        {globalError ? (
          <>
            <TestTracker testsPassed={0} testsNumber={tests.length} />
            <div className="scrollbar-thin overflow-auto border p-4 dark:border-zinc-700">
              <pre className="text-red-500">{globalError.stack}</pre>
            </div>
          </>
        ) : (
          <>
            {testsResults.length > 0 && (
              <TestTracker
                testsPassed={
                  testsResults.filter((result) => result.passed).length
                }
                testsNumber={tests.length}
              />
            )}
            <TestAccordion>
              {tests.map((test, index) => (
                <TestItem
                  key={`test-item-${index}`}
                  test={test}
                  testResult={testsResults[index] || null}
                  testIndex={index}
                />
              ))}
            </TestAccordion>
          </>
        )}
      </div>
    </ResizablePanel>
  );
};

export default TestsPanel;
