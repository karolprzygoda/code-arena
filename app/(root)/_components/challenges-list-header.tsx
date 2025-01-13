import { ReactNode } from "react";

type ChallengesListHeaderProps = {
  children: ReactNode;
};

const ChallengesListHeader = ({ children }: ChallengesListHeaderProps) => {
  return (
    <div
      className={"container flex items-center justify-between gap-3 px-4 pt-5"}
    >
      {children}
    </div>
  );
};

export default ChallengesListHeader;
