import React from "react";
import UserProgressChart from "@/app/(root)/profile/components/user-progress-chart";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const client = await createClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (!user || error) {
    redirect("/sign-in");
  }

  const [solvedChallengesByDifficulty, allChallengesByDifficulty] =
    await Promise.all([
      prismadb.challenge.groupBy({
        by: ["difficulty"],
        _count: {
          id: true,
        },
        where: {
          submission: {
            some: {
              userId: user.id,
              status: "SUCCESS",
            },
          },
        },
        orderBy: {
          difficulty: "asc",
        },
      }),
      prismadb.challenge.groupBy({
        by: ["difficulty"],
        _count: {
          id: true,
        },
        orderBy: {
          difficulty: "asc",
        },
      }),
    ]);

  const chartData = allChallengesByDifficulty.map((item) => {
    const solved =
      solvedChallengesByDifficulty.find((i) => i.difficulty === item.difficulty)
        ?._count.id ?? 0;
    const total = item._count.id;
    return {
      difficulty: item.difficulty,
      total,
      solved,
      completedPercentage: Math.floor((solved / total) * 100),
    };
  });

  const totalSolved = solvedChallengesByDifficulty.reduce(
    (acc, curr) => acc + curr._count.id,
    0,
  );
  const totalChallenges = allChallengesByDifficulty.reduce(
    (acc, curr) => acc + curr._count.id,
    0,
  );

  return (
    <UserProgressChart
      chartData={chartData}
      totalSolved={totalSolved}
      totalChallenges={totalChallenges}
    />
  );
};

export default ProfilePage;
