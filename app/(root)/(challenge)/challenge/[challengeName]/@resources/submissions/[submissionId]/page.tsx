import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmissionCode from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-code";
import GoBackTabHeader from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/go-back-tab-header";
import SubmissionMetadata from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-metadata";
import SubmissionContentWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-content-wrapper";
import { getMaxExecutionTime, getMaxMemoryUsage } from "@/lib/utils";
import PerformanceChart from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/performance-chart";
import SubmissionLogs from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-logs";
import SubmissionErrors from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-errors";
import { Prisma } from "@prisma/client";
import SubmissionGlobalErrorComponent from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-global-error-component";

type SubmissionPageParams = {
  params: Promise<{ challengeName: string; submissionId: string }>;
};

const SubmissionPage = async ({ params }: SubmissionPageParams) => {
  const challengeName = (await params).challengeName;
  const submissionId = (await params).submissionId;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const submission = await prismadb.submission.findFirst({
    where: {
      id: submissionId,
      userId: user.id,
    },
    include: {
      challenge: true,
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
    },
  });

  if (!submission) {
    redirect(`/challenge/${challengeName}/submissions`);
  }

  const allSuccessSubmissions = await prismadb.submission.findMany({
    where: {
      challengeId: submission.challengeId,
      status: "SUCCESS",
      testResults: {
        not: Prisma.JsonNull,
      },
    },
  });

  const runtimes = allSuccessSubmissions
    .flatMap((submission) =>
      getMaxExecutionTime(
        submission.testResults!.map((testResult) => testResult),
      ),
    )
    .map((item) => Number(item?.split(" ").at(0)));

  const memoryUsage = allSuccessSubmissions
    .flatMap((submission) =>
      getMaxMemoryUsage(
        submission.testResults!.map((testResult) => testResult),
      ),
    )
    .map((item) => Number(item?.split(" ").at(0)));

  const markdownCode = `\`\`\`${submission.language.toLowerCase()}\n${submission.code}\n\`\`\``;

  const submissionMemoryUsage = Number(
    getMaxMemoryUsage(submission.testResults).split(" ").at(0),
  );

  const submissionExecutionTime = Number(
    getMaxExecutionTime(submission.testResults).split(" ").at(0),
  );

  return (
    <TabWrapper>
      <GoBackTabHeader
        href={`/challenge/${challengeName}/submissions`}
        title={"All submissions"}
      />
      <SubmissionContentWrapper>
        <SubmissionMetadata submission={submission} user={submission.users} />
        {!isNaN(submissionMemoryUsage) && !isNaN(submissionExecutionTime) && (
          <PerformanceChart
            memoryUsages={memoryUsage}
            executionTimes={runtimes}
            currentMemory={submissionMemoryUsage}
            currentRuntime={submissionExecutionTime}
          />
        )}
        <SubmissionCode code={markdownCode} language={submission.language} />
        {submission.testResults ? (
          <>
            <SubmissionLogs
              submissionId={submissionId}
              testResults={submission.testResults}
            />
            <SubmissionErrors
              submissionId={submissionId}
              testResults={submission.testResults}
            />
          </>
        ) : (
          <SubmissionGlobalErrorComponent
            globalError={submission.globalError}
          />
        )}
      </SubmissionContentWrapper>
    </TabWrapper>
  );
};

export default SubmissionPage;
