type SubmissionGlobalErrorProps = {
  globalError: PrismaJson.ErrorType;
};

const SubmissionGlobalError = ({ globalError }: SubmissionGlobalErrorProps) => {
  return (
    <div className="h-full overflow-y-auto dark:border-zinc-700">
      <div
        className={
          "scrollbar-thin overflow-auto border bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-[#1e1e1e]"
        }
      >
        <pre className={"text-red-500"}>{globalError.stack}</pre>
      </div>
    </div>
  );
};

export default SubmissionGlobalError;
