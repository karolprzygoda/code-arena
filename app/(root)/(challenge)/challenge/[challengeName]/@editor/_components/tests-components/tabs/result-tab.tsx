import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type ResultTabProps = {
  test: PrismaJson.TestCasesType[number];
  testResult: PrismaJson.TestResultsType[number];
};

const ResultTab = ({ test, testResult }: ResultTabProps) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={50}
        className={"scrollbar-thin !overflow-y-auto"}
      >
        <div className="w-full p-4">
          <div className="font-bold text-blue-500">Expected return value</div>
          <div className="mt-3 font-semibold">
            {JSON.stringify(test.expectedOutput)}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="dark:bg-zinc-700" />
      <ResizablePanel
        defaultSize={50}
        className={"scrollbar-thin !overflow-y-auto"}
      >
        <div className="w-full p-4">
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
};

export default ResultTab;
