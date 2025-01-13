import prismadb from "@/lib/prismadb";
import { Difficulty } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import ChallengeCard from "@/app/(root)/_components/challenge-card";
import { createClient } from "@/lib/supabase/server";
import DifficultyTagShadow from "@/app/(root)/_components/difficulty-tag-shadow";

type DifficultyTagChallengesPageParams = {
  params: Promise<{ difficultyTag: string }>;
};

const DifficultyTagChallengesPage = async ({
  params,
}: DifficultyTagChallengesPageParams) => {
  const difficultyTag = (await params).difficultyTag;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sign-in");
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
      <h1
        className={"relative scroll-m-20 text-3xl font-semibold tracking-tight"}
      >
        <DifficultyTagShadow
          difficultyTag={difficultyTag.toUpperCase() as Difficulty}
        />
        {difficultyTag.slice(0, 1).toUpperCase() + difficultyTag.slice(1)}
      </h1>
      <div className={"flex w-full flex-wrap justify-center gap-6"}>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={`${challenge.id}-card`}
            signedInUser={user}
            challenge={challenge}
          />
        ))}
      </div>
    </div>
  );
};

export default DifficultyTagChallengesPage;
