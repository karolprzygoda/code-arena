import { ReactNode } from "react";
import ResourcesWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/resources-wrapper";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

type ResourcesLayoutProps = {
  children: ReactNode;
  params: Promise<{ challengeName: string }>;
};

const ResourcesLayout = async ({ children, params }: ResourcesLayoutProps) => {
  const challengeName = (await params).challengeName;

  const challenges = await prismadb.challenge.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      submission: {
        select: {
          userId: true,
          status: true,
        },
      },
    },
  });

  if (challenges.length < 1) {
    notFound();
  }

  const currenChallengeIndex = challenges.findIndex(
    (challenge) => challenge.title === challengeName,
  );

  const getChallengeLink = (index: number) => {
    const normalizedIndex = (index + challenges.length) % challenges.length;
    return challenges[normalizedIndex].title;
  };

  const prevChallengeLink = getChallengeLink(currenChallengeIndex - 1);
  const nextChallengeLink = getChallengeLink(currenChallengeIndex + 1);

  return (
    <ResourcesWrapper
      challenges={challenges}
      challengeName={challengeName}
      nextChallengeLink={nextChallengeLink}
      prevChallengeLink={prevChallengeLink}
    >
      {children}
    </ResourcesWrapper>
  );
};

export default ResourcesLayout;
