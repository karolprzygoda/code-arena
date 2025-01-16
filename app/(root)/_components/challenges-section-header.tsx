import { ReactNode } from "react";

type ChallengesSectionHeaderProps = {
  children: ReactNode;
};

const ChallengesSectionHeader = ({
  children,
}: ChallengesSectionHeaderProps) => {
  return (
    <div
      className={"container flex items-center justify-between gap-3 px-4 pt-5"}
    >
      {children}
    </div>
  );
};

export default ChallengesSectionHeader;
