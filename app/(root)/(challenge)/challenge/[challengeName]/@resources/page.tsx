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

type DescriptionPageProps = {
  params: Promise<{ challengeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challengeName.split(" ").join("-").toLowerCase(),
    },
    select: {
      description: true,
      title: true,
      createdAt: true,
      creatorId: true,
      difficulty: true,
    },
  });

  if (!data) {
    notFound();
  }

  const supabaseAdminClient = await createAdminClient();
  const supabaseServerClient = await createClient();

  const {
    data: { user: challengeAuthor },
    error: getChallengeAuthorError,
  } = await supabaseAdminClient.auth.admin.getUserById(data.creatorId);

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

  const hasUserSolveChallenge = await prismadb.submission.findFirst({
    where: {
      status: "SUCCESS",
      userId: signedUser?.id,
    },
  });

  const title = data.title
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
            className={cn("rounded-2xl", difficultyColorMap[data.difficulty])}
          >
            {data.difficulty}
          </Badge>
          {hasUserSolveChallenge && (
            <CircleCheck className={"flex-shrink-0 text-green-500"} />
          )}
          <LikeButton />
          <DislikeButton />
          <ShareChallengeButton />
        </div>
      </div>
      <MarkdownRenderer markdown={data.description} />
    </div>
  );
};

export default DescriptionPage;
