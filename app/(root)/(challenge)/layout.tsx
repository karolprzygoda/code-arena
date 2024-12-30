import { ReactNode } from "react";

type ChallengeLayoutProps = {
  children: Readonly<ReactNode>;
};

const ChallengeLayout = ({ children }: ChallengeLayoutProps) => {
  return (
    <div className={"relative h-full w-full overflow-hidden"}>{children}</div>
  );
};

export default ChallengeLayout;
