import prismadb from "@/lib/prismadb";
import { notFound, redirect } from "next/navigation";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import UpVoteChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/up-vote-challenge-button";
import DislikeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/down-vote-challenge-button";
import ShareChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/share-challenge-button";
import VotesStoreProvider from "@/stores/store-providers/votes-store-provider";
import ManageChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/manage-challenge-button";
import { formatDistanceToNow } from "date-fns";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import UserProfileLink from "@/components/user-profile-link";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import { Challenge, Users, Vote } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import IsChallengePassedIndicator from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/is-challenge-passed-indicator";
import { createAdminClient } from "@/lib/supabase/admin";

type DescriptionPageProps = {
  params: Promise<{ challengeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const challengeData = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challengeName.split(" ").join("-").toLowerCase(),
    },
    include: {
      users: true,
    },
  });

  if (!challengeData) {
    notFound();
  }

  const supabaseClient = await createClient();

  const {
    data: { user: signedUser },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !signedUser) {
    redirect("/sign-in");
  }

  const [hasUserSolvedChallenge, totalVotes, userVote] = await Promise.all([
    prismadb.submission.findFirst({
      where: { status: "SUCCESS", userId: signedUser?.id },
    }),
    prismadb.votes.findMany({
      where: { itemId: challengeData.id },
    }),
    prismadb.votes.findFirst({
      where: { itemId: challengeData.id, userId: signedUser.id },
      select: {
        voteType: true,
      },
    }),
  ]);

  const upVotes = totalVotes.filter(
    (vote) => vote.voteType === "UPVOTE",
  ).length;
  const downVotes = totalVotes.filter(
    (vote) => vote.voteType === "DOWNVOTE",
  ).length;

  const title = challengeData.title
    .split("-")
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

  const supabaseAdminClient = await createAdminClient();

  const {
    data: { user: author },
    error: adminError,
  } = await supabaseAdminClient.auth.admin.getUserById(challengeData.users.id);

  if (adminError) {
    throw adminError;
  }

  const isAdmin = await prismadb.userRoles.findFirst({
    where: { userid: author?.id },
  });

  const authorWithRole =
    author && author.id ? { ...author, isAdmin: !!isAdmin } : null;

  return (
    <TabWrapper>
      <div className={"flex flex-col p-4 pb-8"}>
        <DescriptionPageHeader
          upVotes={upVotes}
          downVotes={downVotes}
          userVote={userVote}
          signedUser={signedUser}
          author={authorWithRole}
          title={title}
          challengeData={challengeData}
          hasUserSolvedChallenge={!!hasUserSolvedChallenge}
        />
        <MarkdownRenderer markdown={challengeData.description} />
      </div>
    </TabWrapper>
  );
};

type DescriptionPageHeaderProps = {
  challengeData: Challenge & { users: Users };
  signedUser: User;
  title: string;
  upVotes: number;
  downVotes: number;
  author: (User & { isAdmin: boolean }) | null;
  hasUserSolvedChallenge: boolean;
  userVote: { voteType: Vote } | null;
};

const DescriptionPageHeader = ({
  challengeData,
  signedUser,
  title,
  upVotes,
  downVotes,
  author,
  hasUserSolvedChallenge,
  userVote,
}: DescriptionPageHeaderProps) => {
  return (
    <div className={"mb-8 flex w-full flex-col gap-1"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-3xl font-bold"}>{title}</h2>
        {challengeData.authorId === signedUser.id && (
          <ManageChallengeButton challengeId={challengeData.id} />
        )}
      </div>
      <div className={"flex flex-wrap items-center"}>
        <UserProfileLink user={author} />
        <div
          className={
            "flex items-center gap-2 text-nowrap text-xs text-muted-foreground"
          }
        >
          <Calendar className={"h-4 w-4"} /> Created{" "}
          {formatDistanceToNow(new Date(challengeData.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
      <div className={"mt-2 flex flex-wrap gap-2"}>
        <DifficultyBadge difficulty={challengeData.difficulty} />
        {hasUserSolvedChallenge && <IsChallengePassedIndicator />}
        <VotesStoreProvider
          vote={userVote ? userVote.voteType : null}
          likes={upVotes}
          dislikes={downVotes}
          itemId={challengeData.id}
        >
          <UpVoteChallengeButton />
          <DislikeButton />
        </VotesStoreProvider>
        <ShareChallengeButton />
      </div>
    </div>
  );
};

export default DescriptionPage;
