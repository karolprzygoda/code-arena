import IsChallengePassedIndicator from "@/app/(root)/_components/is-challenge-passed-indicator";
import prismadb from "@/lib/prismadb";
import { Difficulty } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type UserChallengesResultsProps = {
  difficultyTag: Difficulty;
};

const UserChallengesResults = async ({
  difficultyTag,
}: UserChallengesResultsProps) => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sign-in");
  }

  const [numberOfChallenges, numberOfChallengesSolvedByUser] =
    await Promise.all([
      prismadb.challenge.count({
        where: {
          difficulty: difficultyTag,
        },
      }),
      prismadb.challenge.count({
        where: {
          difficulty: difficultyTag,
          submission: {
            some: {
              status: "SUCCESS",
              userId: user.id,
            },
          },
        },
      }),
    ]);

  return (
    <>
      {numberOfChallengesSolvedByUser === numberOfChallenges && (
        <IsChallengePassedIndicator />
      )}
      <span className={"text-sm text-muted-foreground"}>
        {`${numberOfChallengesSolvedByUser} / ${numberOfChallenges} Solved`}
      </span>
    </>
  );
};

export default UserChallengesResults;
