import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import ManageChallengeButton from "@/app/(root)/_components/manage-challenge-button";
import { formatDistanceToNow } from "date-fns";
import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import ChallengeVotes from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/challenge-votes";
import UserContextProvider from "@/components/user-context-provider";
import UserProfileLink from "@/components/user-profile-link";
import ChallengePassedIndicator from "@/app/(root)/_components/challenge-passed-indicator";
import ShareCurrentPathButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/share-current-path-button";
import { fromKebabCaseToPascalCase } from "@/lib/utils";
import { TChallengeData } from "@/lib/types";
// import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";
import SSRMarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown/ssr-markdown-renderer";
// import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown/markdown-renderer";

type DescriptionPageProps = {
  params: Promise<{ challengeName: string }>;
};

const DescriptionPage = async ({ params }: DescriptionPageProps) => {
  const challengeData = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challengeName,
    },
    include: {
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
      submission: {
        where: {
          status: "SUCCESS",
        },
        select: {
          challengeId: true,
          userId: true,
        },
      },
      votes: true,
    },
  });

  if (!challengeData) {
    notFound();
  }

  const upVotes = challengeData.votes.filter(
    (vote) => vote.voteType === "UPVOTE",
  ).length;
  const downVotes = challengeData.votes.filter(
    (vote) => vote.voteType === "DOWNVOTE",
  ).length;

  const title = fromKebabCaseToPascalCase(challengeData.title);

  return (
    <TabWrapper>
      <div className={"flex flex-col p-4 pb-8"}>
        <UserContextProvider>
          <DescriptionPageHeader
            upVotes={upVotes}
            downVotes={downVotes}
            title={title}
            challengeData={challengeData}
          />
        </UserContextProvider>
        {/*<MemoizedMarkdown content={challengeData.description} id={"xd"} />*/}
        {/*<MarkdownRenderer markdown={challengeData.description} />*/}
        <SSRMarkdownRenderer markdown={challengeData.description} />
      </div>
    </TabWrapper>
  );
};

type DescriptionPageHeaderProps = {
  challengeData: TChallengeData;
  title: string;
  upVotes: number;
  downVotes: number;
};

const DescriptionPageHeader = ({
  challengeData,
  title,
  upVotes,
  downVotes,
}: DescriptionPageHeaderProps) => {
  return (
    <div className={"mb-8 flex w-full flex-col gap-2"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-3xl font-bold"}>{title}</h2>
        <ManageChallengeButton
          challengeId={challengeData.id}
          challengeTitle={challengeData.title}
        />
      </div>
      <div className={"flex flex-wrap items-center gap-4"}>
        <UserProfileLink user={challengeData.users} />
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
      <div className={"mt-2 flex flex-wrap gap-2 gap-y-4"}>
        <DifficultyBadge difficulty={challengeData.difficulty} />
        <div className={"flex gap-2"}>
          <ChallengeVotes
            upVotes={upVotes}
            difficulty={challengeData.difficulty}
            downVotes={downVotes}
            challengeTitle={challengeData.title}
          />
          <ShareCurrentPathButton />
        </div>
        <ChallengePassedIndicator
          challengeId={challengeData.id}
          submissions={challengeData.submission}
        />
      </div>
    </div>
  );
};

export default DescriptionPage;
