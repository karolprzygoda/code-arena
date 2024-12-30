type ConsoleLogsTabProps = {
  testIndex: number;
  testResult: PrismaJson.TestResultsType[number];
};

const ConsoleLogsTab = ({ testResult, testIndex }: ConsoleLogsTabProps) => {
  return (
    <div className="flex w-full flex-col p-4 font-semibold">
      {!testResult && "Submit your solution to see output and console logs."}
      {testResult?.logs.length === 0 && "Empty"}
      {testResult?.logs?.map((log, logIndex) => (
        <div key={`test-${testIndex}-log-${logIndex}`}>{log}</div>
      ))}
    </div>
  );
};

export default ConsoleLogsTab;
