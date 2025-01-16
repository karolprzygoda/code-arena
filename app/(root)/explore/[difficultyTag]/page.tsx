import prismadb from "@/lib/prismadb";
import { Difficulty } from "@prisma/client";
import { notFound } from "next/navigation";
import ChallengeCard from "@/app/(root)/_components/challenge-card";
import DifficultyTagShadow from "@/app/(root)/_components/difficulty-tag-shadow";
import UserContextProvider from "@/components/user-context-provider";

export async function generateStaticParams() {
  return Array.from(Object.values(Difficulty)).map((difficulty) => ({
    difficultyTag: difficulty.toLowerCase(),
  }));
}

type DifficultyTagChallengesPageParams = {
  params: Promise<{ difficultyTag: string }>;
};

const DifficultyTagChallengesPage = async ({
  params,
}: DifficultyTagChallengesPageParams) => {
  const difficultyTag = (await params).difficultyTag;

  const allowedDifficulties = Object.values(Difficulty).map((d) =>
    d.toLowerCase(),
  );

  if (!allowedDifficulties.includes(difficultyTag)) {
    notFound();
  }

  const challenges = await prismadb.challenge.findMany({
    where: {
      difficulty: difficultyTag.toUpperCase() as Difficulty,
    },
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
  });

  if (challenges.length < 1) {
    notFound();
  }

  return (
    <div
      className={
        "md:pb-20s container flex flex-col items-center gap-8 py-5 md:gap-16"
      }
    >
      <h2
        className={"relative scroll-m-20 text-3xl font-semibold tracking-tight"}
      >
        <DifficultyTagShadow
          difficultyTag={difficultyTag.toUpperCase() as Difficulty}
        />
        {difficultyTag.slice(0, 1).toUpperCase() + difficultyTag.slice(1)}
      </h2>
      <div className={"flex w-full flex-wrap justify-center gap-6"}>
        <UserContextProvider>
          {challenges.map((challenge) => (
            <ChallengeCard key={`${challenge.id}-card`} challenge={challenge} />
          ))}
        </UserContextProvider>
      </div>
    </div>
  );
};

export default DifficultyTagChallengesPage;
