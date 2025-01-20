import prismadb from "@/lib/prismadb";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown/markdown-renderer";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import GoBackTabHeader from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/go-back-tab-header";
import ShareCurrentPathButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/share-current-path-button";
import LanguageBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/language-badge";
import ManageSolutionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/manage-solutions-button";
import UserProfileLink from "@/components/user-profile-link";
import SolutionVotes from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/solutions/_components/solution-votes";

type CurrentSolutionPageParams = {
  params: Promise<{ solutionId: string }>;
};

const CurrentSolutionPage = async ({ params }: CurrentSolutionPageParams) => {
  const solutionId = (await params).solutionId;

  const solution = await prismadb.solution.findFirst({
    where: {
      id: solutionId,
    },
    include: {
      challenge: {
        select: {
          title: true,
        },
      },
      users: {
        select: {
          id: true,
          profile_picture: true,
          email: true,
          userRoles: {
            select: {
              role: true,
            },
          },
        },
      },
      votes: true,
    },
  });

  if (!solution) {
    notFound();
  }

  const upVotes = solution.votes.filter(
    (vote) => vote.voteType === "UPVOTE",
  ).length;
  const downVotes = solution.votes.filter(
    (vote) => vote.voteType === "DOWNVOTE",
  ).length;

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
                <ManageSolutionButton
                  solutionId={solution.id}
                  authorId={solution.authorId}
                />
              </div>
              <div className={"flex flex-wrap items-center gap-4"}>
                <UserProfileLink user={solution.users} />
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
                <div className={"flex gap-2"}>
                  <SolutionVotes
                    solutionId={solution.id}
                    upVotes={upVotes}
                    downVotes={downVotes}
                    challengeTitle={solution.challenge.title}
                  />
                  <ShareCurrentPathButton />
                </div>
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
