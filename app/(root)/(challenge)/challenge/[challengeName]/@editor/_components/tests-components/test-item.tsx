import {
  TestAccordionContent,
  TestAccordionItem,
  TestAccordionTrigger,
} from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/test-accordion";
import {
  TestTabs,
  TestTabsContent,
  TestTabsList,
  TestTabTrigger,
} from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/test-tabs";
import InputsTab from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tabs/inputs-tab";
import ResultTab from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tabs/result-tab";
import ConsoleLogsTab from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tabs/console-logs-tab";
import ErrorsTab from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tabs/errors-tab";
import { EyeOff } from "lucide-react";

type TestItemProps = {
  test: PrismaJson.TestCasesType[number];
  testIndex: number;
  testResult: PrismaJson.TestResultsType[number];
};

const TestItem = ({ test, testIndex, testResult }: TestItemProps) => {
  return (
    <TestAccordionItem value={`test-${testIndex}`}>
      <TestAccordionTrigger
        hiddenTest={test.hidden}
        testResult={testResult}
        testNumber={testIndex}
      />
      <TestAccordionContent>
        {test.hidden ? (
          <div
            className={
              "flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-muted-foreground"
            }
          >
            <EyeOff className={"h-10 w-10"} />
            <span className={"text-xl font-semibold"}>Hidden Test</span>
          </div>
        ) : (
          <TestTabs defaultValue={"inputs-tab"}>
            <TestTabsList>
              <TestTabTrigger value={"inputs-tab"}>Inputs</TestTabTrigger>
              <TestTabTrigger value={"result-tab"}>Result</TestTabTrigger>
              <TestTabTrigger value={"logs-tab"}>
                {testResult?.logs.length > 0 && (
                  <div
                    className={
                      "absolute -right-3 top-0 h-2 w-2 rounded-full bg-orange-500"
                    }
                  ></div>
                )}
                Console
              </TestTabTrigger>
              <TestTabTrigger value={"errors-tab"}>
                {testResult?.error && (
                  <div
                    className={
                      "absolute -right-3 top-0 h-2 w-2 rounded-full bg-orange-500"
                    }
                  ></div>
                )}
                Error
              </TestTabTrigger>
            </TestTabsList>
            <TestTabsContent value={"inputs-tab"}>
              <InputsTab test={test} />
            </TestTabsContent>
            <TestTabsContent value={"result-tab"}>
              <ResultTab testResult={testResult} test={test} />
            </TestTabsContent>
            <TestTabsContent value={"logs-tab"}>
              <ConsoleLogsTab testIndex={testIndex} testResult={testResult} />
            </TestTabsContent>
            <TestTabsContent value={"errors-tab"}>
              <ErrorsTab testResult={testResult} />
            </TestTabsContent>
          </TestTabs>
        )}
      </TestAccordionContent>
    </TestAccordionItem>
  );
};

export default TestItem;
