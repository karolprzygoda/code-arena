import { ReactNode } from "react";
import type { Metadata } from "next";
import { ResizableHandle } from "@/components/ui/resizable";
import ChallengeDashboardWrapper from "@/app/(root)/(challenge)/_components/challenge-dashboard-wrapper";
import prismadb from "@/lib/prismadb";
import { fromKebabCaseToPascalCase } from "@/lib/utils";

export async function generateStaticParams() {
  const challenges = await prismadb.challenge.findMany({
    select: {
      title: true,
      solution: {
        select: {
          id: true,
        },
      },
    },
  });

  return challenges.flatMap((challenge) => {
    const mainPath = [{ challengeName: challenge.title }];

    const solutionPaths = challenge.solution.map((solution) => ({
      challengeName: challenge.title,
      solutionId: solution.id,
    }));

    return [...mainPath, ...solutionPaths];
  });
}

export const generateMetadata = async ({
  params,
}: CurrentChallengeLayoutProps): Promise<Metadata> => {
  const name = (await params).challengeName;

  return {
    title: `${fromKebabCaseToPascalCase(name)} - CodeArena`,
  };
};

type CurrentChallengeLayoutProps = {
  editor: ReactNode;
  resources: ReactNode;
  params: Promise<{ challengeName: string }>;
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
