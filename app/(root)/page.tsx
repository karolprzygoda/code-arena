import TitleSection from "@/app/(root)/_components/title-section";
import ChallengesListSection from "@/app/(root)/_components/challenges-list-section";
import prismadb from "@/lib/prismadb";
import { notFound, redirect } from "next/navigation";
import { Difficulty } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";

const RootPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sign-in");
  }

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

  if (challengesPerDifficulty.length < 5) {
    notFound();
  }

  return (
    <div className={"flex flex-col gap-8 py-8 md:gap-10"}>
      <TitleSection />
      {challengesPerDifficulty.map((challenges, index) => (
        <ChallengesListSection
          key={`challenges-section-${index}`}
          signedInUser={user}
          challenges={challenges}
        />
      ))}
    </div>
  );
};

export default RootPage;
