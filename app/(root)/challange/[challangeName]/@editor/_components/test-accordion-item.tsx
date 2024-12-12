import TestAccordionTrigger from "@/app/(root)/challange/_components/buttons/test-accordion-trigger";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import TestTabTrigger from "@/app/(root)/challange/_components/buttons/test-tab-trigger";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type TestAccordionItemProps = {
  test: PrismaJson.TestCasesType[number];
  testResult: PrismaJson.TestResultsType[number] | undefined;
  index: number;
};

const TestAccordionItem = ({
  test,
  testResult,
  index,
}: TestAccordionItemProps) => {
  return (
    <AccordionItem
      className={"h-auto dark:border-zinc-700"}
      value={`test-${index}`}
    >
      <TestAccordionTrigger testNumber={index} testResult={testResult} />
      <AccordionContent className={"h-40 border-t p-0 dark:border-zinc-700"}>
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
            <TestTabTrigger value={"return"}>Return Value</TestTabTrigger>
            <TestTabTrigger
              notification={testResult && testResult.logs.length > 0}
              value={"console"}
            >
              Console Output
            </TestTabTrigger>
            <TestTabTrigger value={"error"}>Error Output</TestTabTrigger>
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
            <ReturnValueComparison
              expectedOutput={test.expectedOutput}
              testResult={testResult}
            />
          </TabsContent>
          <TabsContent
            className={"m-0 w-full overflow-y-auto"}
            style={{ scrollbarWidth: "thin" }}
            value="console"
          >
            <div className="flex w-full flex-col p-4 font-semibold">
              {!testResult &&
                "Submit your solution to see output and console logs."}
              {testResult?.logs.length === 0 && "Empty"}
              {testResult?.logs?.map((log, logIndex) => (
                <div key={`test-${index}-log-${logIndex}`}>{log}</div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};

type ReturnValueComparisonProps = {
  expectedOutput: unknown;
  testResult: PrismaJson.TestResultsType[number] | undefined;
};

const ReturnValueComparison = ({
  expectedOutput,
  testResult,
}: ReturnValueComparisonProps) => (
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel
      defaultSize={50}
      style={{ overflowY: "auto", scrollbarWidth: "thin" }}
    >
      <div className="w-full p-4">
        <div className="font-bold text-blue-500">Expected return value</div>
        <div className="mt-3 font-semibold">
          {JSON.stringify(expectedOutput)}
        </div>
      </div>
    </ResizablePanel>
    <ResizableHandle withHandle className="dark:bg-zinc-700" />
    <ResizablePanel
      defaultSize={50}
      style={{ overflowY: "auto", scrollbarWidth: "thin" }}
    >
      <div className="h-full w-full p-4">
        <div className="font-bold text-blue-500">Your return value</div>
        <div className="mt-3 font-semibold">
          {!testResult
            ? "Submit your solution to see output and console logs."
            : (JSON.stringify(testResult.actualOutput) ?? "undefined")}
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
);

export default TestAccordionItem;
