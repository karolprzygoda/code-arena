import { Separator } from "@/components/ui/separator";

type SubmissionLogsProps = {
  testResults: PrismaJson.TestResultsType;
  submissionId: string;
};

const SubmissionLogs = ({ testResults, submissionId }: SubmissionLogsProps) => {
  const testsWithIndex = testResults.map((testResult, index) => ({
    ...testResult,
    index: index,
  }));

  const sanitizedTests = testsWithIndex.filter(
    (testResult) => testResult.logs.length > 0,
  );

  if (sanitizedTests.length < 1) {
    return null;
  }

  return (
    <div className={"flex w-full flex-col gap-2"}>
      <div className={"font-semibold text-muted-foreground"}>
        Console Outputs
      </div>
      <div
        className={
          "flex w-full flex-col gap-4 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700"
        }
      >
        {sanitizedTests.map((test, index) => (
          <div
            key={`submission-${submissionId}-test-${test.index}-log-wrapper-${index}`}
            className={"flex w-full flex-col gap-1"}
          >
            <div
              className={
                "flex items-center gap-2 text-sm font-semibold text-muted-foreground"
              }
            >
              Test
              <Separator
                orientation="vertical"
                className={"h-3 bg-muted-foreground"}
              />
              {test.index + 1}
            </div>
            <div
              className={
                "flex flex-col gap-1 rounded-md bg-zinc-100 p-4 dark:bg-[#1e1e1e]"
              }
            >
              {test.logs.map((log, index) => (
                <span
                  key={`submission-${submissionId}-test-${test.index}-log-${index}`}
                >
                  {log}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionLogs;
