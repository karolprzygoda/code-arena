"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { Accordion } from "@/components/ui/accordion";
import { useStore } from "zustand/index";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { useShallow } from "zustand/react/shallow";
import TestTracker from "@/app/(root)/challange/[challangeName]/@editor/_components/test-tracker";
import { useEditorStore } from "@/stores/editor-store";
import { Icons } from "@/components/icons";
import TestAccordionItem from "@/app/(root)/challange/[challangeName]/@editor/_components/test-accordion-item";

type TestsPanelProps = {
  tests: PrismaJson.TestCasesType;
};

const TestsPanel = ({ tests }: TestsPanelProps) => {
  const { testsResults, globalError } = useStore(
    useTestResultsStore,
    useShallow((state) => ({
      testsResults: state.testsResults,
      globalError: state.globalError,
    })),
  );

  const { isPending } = useStore(
    useEditorStore,
    useShallow((state) => ({
      isPending: state.isPending,
    })),
  );

  if (isPending) {
    return (
      <ResizablePanel>
        <div className="flex h-full items-center justify-center dark:bg-[#1e1e1e]">
          <Icons.loadingSpinner />
        </div>
      </ResizablePanel>
    );
  }

  if (globalError) {
    return (
      <ResizablePanel id={"test-panel"} defaultSize={30}>
        <div className="h-full overflow-y-auto p-4 dark:border-zinc-700 dark:bg-[#1e1e1e]">
          <TestTracker testsPassed={0} testsNumber={tests.length} />
          <div className={"border p-4 dark:border-zinc-700"}>
            <pre className={"text-red-500"}>{globalError.stack}</pre>
          </div>
        </div>
      </ResizablePanel>
    );
  }

  return (
    <ResizablePanel id={"test-panel"} defaultSize={30}>
      <div className="h-full overflow-y-auto p-3 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        {testsResults.length !== 0 && (
          <TestTracker
            testsPassed={testsResults.filter((result) => result.passed).length}
            testsNumber={tests.length}
          />
        )}
        <Accordion
          className={"border border-b-0 dark:border-zinc-700"}
          type="single"
          collapsible
          defaultValue={"test-0"}
        >
          {tests.map((test, index) => (
            <TestAccordionItem
              test={test}
              testResult={testsResults[index]}
              index={index}
              key={`accordion-test-${index}`}
            />
          ))}
        </Accordion>
      </div>
    </ResizablePanel>
  );
};

export default TestsPanel;
