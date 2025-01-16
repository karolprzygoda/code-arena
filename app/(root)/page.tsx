import TitleSection from "@/app/(root)/_components/title-section";
import ChallengesSection from "@/app/(root)/_components/challenges-section";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { Difficulty } from "@prisma/client";
import UserContextProvider from "@/components/user-context-provider";
import SolvedChallengesContextProvider from "@/components/solved-challenges-context-provider";

const RootPage = async () => {
  const difficulties = Object.values(Difficulty);
  const challengesPerDifficulty = await Promise.all(
    difficulties.map((difficulty) =>
      prismadb.challenge.findMany({
        where: {
          difficulty: difficulty,
        },
        take: 5,
        select: {
          id: true,
          title: true,
          difficulty: true,
          createdAt: true,
          descriptionSnippet: true,
          submission: {
            where: {
              status: "SUCCESS",
            },
            select: {
              userId: true,
              challengeId: true,
            },
          },
          users: {
            select: {
              email: true,
            },
          },
          votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ),
  );

  const allChallenges = await prismadb.challenge.findMany({
    select: {
      difficulty: true,
    },
  });

  if (challengesPerDifficulty.length < 5) {
    notFound();
  }

  return (
    <div className={"flex flex-col gap-8 py-8 md:gap-10"}>
      <TitleSection />
      <UserContextProvider>
        <SolvedChallengesContextProvider>
          {challengesPerDifficulty.map((challenges, index) => (
            <ChallengesSection
              key={`challenges-section-${index}`}
              challenges={challenges}
              allChallenges={allChallenges}
            />
          ))}
        </SolvedChallengesContextProvider>
      </UserContextProvider>
    </div>
  );
};

export default RootPage;
