import prismadb from "@/lib/prismadb";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";
import { notFound, redirect } from "next/navigation";
import UserProfileLink from "@/components/user-profile-link";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import GoBackTabHeader from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/go-back-tab-header";
import UpVoteButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/up-vote-button";
import DownVoteButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/down-vote-button";
import VotesStoreProvider from "@/stores/store-providers/votes-store-provider";
import { createClient } from "@/lib/supabase/server";
import ShareCurrentPathButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/share-current-path-button";
import LanguageBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/language-badge";
import { getUserById } from "@/actions/auth-actions";
import { getUserProfilePicture } from "@/lib/utils";
import ManageSolutionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/manage-solutions-button";

type CurrentSolutionPageParams = {
  params: Promise<{ solutionId: string }>;
};

const CurrentSolutionPage = async ({ params }: CurrentSolutionPageParams) => {
  const solutionId = (await params).solutionId;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sign-in");
  }

  const [solution, totalVotes, userVote] = await Promise.all([
    prismadb.solution.findFirst({
      where: {
        id: solutionId,
      },
      include: {
        challenge: {
          select: {
            title: true,
          },
        },
      },
    }),
    prismadb.votes.findMany({
      where: { itemId: solutionId },
    }),
    prismadb.votes.findFirst({
      where: { itemId: solutionId, userId: user.id },
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

  if (!solution) {
    notFound();
  }

  const solutionUser = await getUserById(solution.authorId);

  const solutionUserProfilePicture = getUserProfilePicture(solutionUser);

  return (
    <TabWrapper>
      <GoBackTabHeader
        href={`/challenge/${solution.challenge.title}/solutions`}
        title={"All solutions"}
      />
      <div className={"relative h-full w-full"}>
        <div className={"absolute h-full w-full overflow-auto"}>
          <div className={"flex flex-col p-4 pb-8"}>
            <div className={"mb-8 flex w-full flex-col items-start gap-3"}>
              <div className={"flex w-full items-center justify-between"}>
                <h2 className={"font-bold"}>{solution.title}</h2>
                {user?.id === solution.authorId && (
                  <ManageSolutionButton solutionId={solution.id} />
                )}
              </div>
              <div className={"flex flex-wrap items-center gap-4"}>
                <UserProfileLink
                  user={{
                    id: solutionUser.id,
                    isAdmin: solutionUser.isAdmin,
                    email: solutionUser.email!,
                    profileImageSrc: solutionUserProfilePicture,
                  }}
                />
                <div
                  className={
                    "text flex items-center gap-1 text-xs text-muted-foreground"
                  }
                >
                  <Calendar className={"h-4 w-4 shrink-0 text-nowrap"} />
                  {formatDistanceToNow(new Date(solution.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className={"flex w-full flex-wrap justify-between gap-3"}>
                <LanguageBadge language={solution.language} />
                <VotesStoreProvider
                  vote={userVote ? userVote.voteType : null}
                  upVotes={upVotes}
                  downVotes={downVotes}
                  itemId={solution.id}
                >
                  <div className={"flex gap-2"}>
                    <UpVoteButton />
                    <DownVoteButton />
                    <ShareCurrentPathButton />
                  </div>
                </VotesStoreProvider>
              </div>
            </div>
            <MarkdownRenderer markdown={solution.description} />
          </div>
        </div>
      </div>
    </TabWrapper>
  );
};

export default CurrentSolutionPage;
