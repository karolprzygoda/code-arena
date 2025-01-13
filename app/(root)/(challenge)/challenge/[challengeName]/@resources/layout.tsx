import { ReactNode } from "react";
import ResourcesWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/resources-wrapper";
import prismadb from "@/lib/prismadb";

type ResourcesLayoutProps = {
  children: ReactNode;
  params: Promise<{ challengeName: string }>;
};

const ResourcesLayout = async ({ children, params }: ResourcesLayoutProps) => {
  const challenges = await prismadb.challenge.findMany({
    select: {
      title: true,
      difficulty: true,
    },
  });

  return (
    <ResourcesWrapper
      challenges={challenges}
      challengeName={(await params).challengeName}
    >
      {children}
    </ResourcesWrapper>
  );
};

export default ResourcesLayout;
