import { ReactNode } from "react";

type CreateChallengeWrapperProps = {
  children: ReactNode;
};

const ManageChallengePageWrapper = ({
  children,
}: CreateChallengeWrapperProps) => {
  return (
    <div
      className={
        "absolute flex h-full w-full flex-col-reverse gap-4 overflow-auto pt-2 lg:flex-row lg:overflow-hidden lg:pt-0"
      }
    >
      {children}
    </div>
  );
};

export default ManageChallengePageWrapper;
