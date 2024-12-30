import { ReactNode } from "react";
import type { Metadata } from "next";
import { ResizableHandle } from "@/components/ui/resizable";
import ChallengeDashboardWrapper from "@/app/(root)/(challenge)/_components/challenge-dashboard-wrapper";

type CurrentChallengeLayoutProps = {
  editor: ReactNode;
  resources: ReactNode;
  params: Promise<{ challengeName: string }>;
};

export const generateMetadata = async ({
  params,
}: CurrentChallengeLayoutProps): Promise<Metadata> => {
  const name = (await params).challengeName;

  return {
    title: `${name
      .split("-")
      .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
      .join(" ")} - CodeArena`,
  };
};

const CurrentChallengeLayout = ({
  editor,
  resources,
}: CurrentChallengeLayoutProps) => {
  return (
    <ChallengeDashboardWrapper>
      {resources}
      <ResizableHandle
        className={"group order-2 bg-background p-2"}
        withCustomHandle
      />
      {editor}
    </ChallengeDashboardWrapper>
  );
};

export default CurrentChallengeLayout;
