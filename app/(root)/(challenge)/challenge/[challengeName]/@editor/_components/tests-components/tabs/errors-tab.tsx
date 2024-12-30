type ErrorsTabProps = {
  testResult: PrismaJson.TestResultsType[number];
};

const ErrorsTab = ({ testResult }: ErrorsTabProps) => {
  return (
    <div
      className={"scrollbar-thin h-full w-full overflow-auto p-4 font-semibold"}
    >
      {!testResult ? (
        "Submit your solution to see if there are any errors."
      ) : !testResult.error ? (
        "Empty"
      ) : (
        <pre className="text-red-500">{testResult.error.message}</pre>
      )}
    </div>
  );
};

export default ErrorsTab;
