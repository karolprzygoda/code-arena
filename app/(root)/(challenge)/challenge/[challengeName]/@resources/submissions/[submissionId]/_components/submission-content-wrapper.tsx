import { ReactNode } from "react";

type SubmissionContentWrapperProps = {
  children: ReactNode;
};

const SubmissionContentWrapper = ({
  children,
}: SubmissionContentWrapperProps) => {
  return (
    <div className={"relative h-full w-full"}>
      <div className={"absolute h-full w-full overflow-auto"}>
        <div className={"mx-auto flex max-w-[700px] flex-col gap-4 p-4"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SubmissionContentWrapper;
