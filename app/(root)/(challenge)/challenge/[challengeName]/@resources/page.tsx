import prismadb from "@/lib/prismadb";
import { notFound, redirect } from "next/navigation";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { CircleCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LikeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/like-button";
import DislikeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/dislike-button";
import ShareChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/share-challenge-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VotesStoreProvider from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/votes-store-provider";

type DescriptionPageProps = {
  params: Promise<{ challengeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const challengeData = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challengeName.split(" ").join("-").toLowerCase(),
    },
    select: {
      description: true,
      title: true,
      createdAt: true,
      creatorId: true,
      difficulty: true,
      id: true,
    },
  });

  if (!challengeData) {
    notFound();
  }

  const supabaseAdminClient = await createAdminClient();
  const supabaseServerClient = await createClient();

  const {
    data: { user: challengeAuthor },
    error: getChallengeAuthorError,
  } = await supabaseAdminClient.auth.admin.getUserById(challengeData.creatorId);

  const {
    data: { user: signedUser },
    error: authError,
  } = await supabaseServerClient.auth.getUser();

  if (authError || !signedUser) {
    redirect("/sign-in");
  }

  if (getChallengeAuthorError) {
    throw getChallengeAuthorError;
  }

  const hasUserSolvedChallenge = await prismadb.submission.findFirst({
    where: {
      status: "SUCCESS",
      userId: signedUser?.id,
    },
  });

  const votes = await prismadb.votes.findMany({
    where: {
      challengeId: challengeData.id,
    },
    select: {
      voteType: true,
    },
  });

  const likes = votes.filter((vote) => vote.voteType === "LIKE");
  const disLikes = votes.filter((vote) => vote.voteType === "DISLIKE");

  const userVote = await prismadb.votes.findFirst({
    where: {
      challengeId: challengeData.id,
      user_id: signedUser.id,
    },
    select: {
      voteType: true,
    },
  });

  const title = challengeData.title
    .split("-")
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

  const userName = challengeAuthor?.email?.split("@").at(0);

  const difficultyColorMap = {
    BEGINNER: "bg-difficulty-beginner",
    EASY: "bg-difficulty-easy",
    MEDIUM: "bg-difficulty-medium",
    HARD: "bg-difficulty-hard",
    EXTREME: "bg-difficulty-easy",
  };

  return (
    <div className={"flex flex-col"}>
      <div className={"mb-8 flex w-full flex-col gap-1"}>
        <h2 className={"text-3xl font-bold"}>{title}</h2>
        <div>
          <Button
            variant={"ghost"}
            className={
              "bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text p-0 text-xs font-semibold text-transparent dark:from-rose-400 dark:to-orange-300"
            }
          >
            @{userName}
          </Button>
        </div>
        <div className={"mt-2 flex flex-wrap gap-2"}>
          <Badge
            className={cn(
              "rounded-2xl",
              difficultyColorMap[challengeData.difficulty],
            )}
          >
            {challengeData.difficulty}
          </Badge>
          {hasUserSolvedChallenge && (
            <CircleCheck className={"flex-shrink-0 text-green-500"} />
          )}
          <VotesStoreProvider
            vote={userVote ? userVote.voteType : null}
            likes={likes.length}
            dislikes={disLikes.length}
          >
            <LikeButton challengeId={challengeData.id} />
            <DislikeButton challengeId={challengeData.id} />
          </VotesStoreProvider>
          <ShareChallengeButton />
        </div>
      </div>
      <MarkdownRenderer markdown={challengeData.description} />
    </div>
  );
};

export default DescriptionPage;
