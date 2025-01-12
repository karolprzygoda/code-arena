import { Separator } from "@/components/ui/separator";

type SubmissionErrorsProps = {
  testResults: PrismaJson.TestResultsType;
  submissionId: string;
};

const SubmissionErrors = ({
  testResults,
  submissionId,
}: SubmissionErrorsProps) => {
  const testsWithIndex = testResults.map((testResult, index) => ({
    ...testResult,
    index: index,
  }));

  const sanitizedTests = testsWithIndex.filter(
    (testResult) => testResult.error,
  );

  if (sanitizedTests.length < 1) {
    return null;
  }

  return (
    <div className={"flex w-full flex-col gap-2"}>
      <div className={"font-semibold text-muted-foreground"}>Error</div>
      <div
        className={
          "flex w-full flex-col gap-4 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700"
        }
      >
        {sanitizedTests.map((test, index) => (
          <div
            key={`submission-${submissionId}-test-${test.index}-error-wrapper-${index}`}
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
              <span className="text-red-500">{test.error?.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionErrors;
