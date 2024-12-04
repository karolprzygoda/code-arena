"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useStore } from "zustand/index";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { useShallow } from "zustand/react/shallow";
import { Test } from "@/lib/types";
import TestTabTrigger from "@/app/(root)/challange/[challangeName]/@editor/_components/test-tab-trigger";

type TestsPanelProps = {
  tests: Test[];
};

const TestsPanel = ({ tests }: TestsPanelProps) => {
  const { testsResults, globalError } = useStore(
    useTestResultsStore,
    useShallow((state) => ({
      testsResults: state.testsResults,
      globalError: state.globalError,
    })),
  );

  if (globalError) {
    return (
      <ResizablePanel id={"test-panel"} defaultSize={30}>
        <div className="h-full overflow-y-auto p-4 dark:border-zinc-700 dark:bg-[#1e1e1e]">
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
        <Accordion
          className={"border border-b-0 dark:border-zinc-700"}
          type="single"
          collapsible
          defaultValue={"test-0"}
        >
          {tests.map((test, index) => (
            <AccordionItem
              className={"h-auto dark:border-zinc-700"}
              key={`test-${index}`}
              value={`test-${index}`}
            >
              <AccordionTrigger className={"px-5 font-semibold"}>
                {`Test ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent
                className={"h-40 border-t p-0 dark:border-zinc-700"}
              >
                <Tabs
                  defaultValue="input"
                  orientation={"vertical"}
                  className="flex h-full w-full p-0"
                >
                  <TabsList
                    className={
                      "flex h-full flex-col items-start justify-start bg-transparent p-0"
                    }
                  >
                    <TestTabTrigger value={"input"}>Input</TestTabTrigger>
                    <TestTabTrigger value={"return"}>
                      Return Value
                    </TestTabTrigger>
                    <TestTabTrigger
                      notification={testsResults[index]?.logs!.length > 0}
                      value={"console"}
                    >
                      Console Output
                    </TestTabTrigger>
                    <TestTabTrigger value={"error"}>
                      Error Output
                    </TestTabTrigger>
                  </TabsList>
                  <TabsContent
                    className={"fo m-0 overflow-y-auto p-4"}
                    style={{ scrollbarWidth: "thin" }}
                    value="input"
                  >
                    <div className={"flex flex-col gap-2 font-semibold"}>
                      {test.inputs.map((input) => (
                        <div key={input.name}>
                          {input.name + ": " + JSON.stringify(input.value)}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent
                    className={"m-0 w-full overflow-y-auto"}
                    value="return"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel
                        defaultSize={50}
                        style={{ overflowY: "auto", scrollbarWidth: "thin" }}
                      >
                        <div className={"w-full p-4"}>
                          <div className={"font-bold text-blue-500"}>
                            Expected return value
                          </div>
                          <div className={"mt-3 font-semibold"}>
                            {test.expectedOutput}
                          </div>
                        </div>
                      </ResizablePanel>
                      <ResizableHandle
                        withHandle
                        className={"dark:bg-zinc-700"}
                      />
                      <ResizablePanel
                        defaultSize={50}
                        style={{ overflowY: "auto", scrollbarWidth: "thin" }}
                      >
                        <div className={"h-full w-full p-4"}>
                          <div className={"font-bold text-blue-500"}>
                            Your return value
                          </div>
                          <div className="mt-3 font-semibold">
                            {testsResults.length === 0
                              ? "Submit your solution to see output and console logs."
                              : (testsResults[index]?.actualOutput ??
                                "undefined")}
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </TabsContent>
                  <TabsContent
                    className={"m-0 w-full overflow-y-auto"}
                    style={{ scrollbarWidth: "thin" }}
                    value="console"
                  >
                    <div className={"flex w-full flex-col p-4 font-semibold"}>
                      {testsResults.length === 0
                        ? "Submit your solution to see output and console logs."
                        : testsResults[index]?.logs?.length === 0
                          ? "Empty"
                          : testsResults[index]?.logs?.map((log, logIndex) => (
                              <div key={`test-${index}-log-${logIndex}`}>
                                {log}
                              </div>
                            ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ResizablePanel>
  );
};

export default TestsPanel;
