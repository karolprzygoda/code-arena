import TabWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/tab-wrapper";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SubmissionCode from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-code";
import SubmissionHeader from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-header";
import SubmissionMetadata from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-metadata";
import SubmissionContentWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/submission-content-wrapper";
import { getMaxExecutionTime, getMaxMemoryUsage } from "@/lib/utils";
import PerformanceChart from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/[submissionId]/_components/performance-chart";

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
    redirect("/login");
  }

  const submission = await prismadb.submission.findFirst({
    where: {
      id: submissionId,
      userId: user.id,
    },
    include: {
      challenge: true,
    },
  });

  if (!submission) {
    redirect(`/challenge/${challengeName}/submissions`);
  }

  const allSubmissions = await prismadb.submission.findMany({
    where: {
      challengeId: submission.challengeId,
      status: "SUCCESS",
    },
  });

  if (!allSubmissions) {
    redirect(`/challenge/${challengeName}/submissions`);
  }

  const runtimes = allSubmissions
    .flatMap((submission) =>
      getMaxExecutionTime(
        submission.testResults.map((testResult) => testResult),
      ),
    )
    .map((item) => Number(item.split(" ").at(0)));

  const memoryUsage = allSubmissions
    .flatMap((submission) =>
      getMaxMemoryUsage(submission.testResults.map((testResult) => testResult)),
    )
    .map((item) => Number(item.split(" ").at(0)));

  const markdownCode = `\`\`\`${submission.language.toLowerCase()}\n${submission.code}\n\`\`\``;

  const isAdmin = await prismadb.userRoles.findFirst({
    where: { userid: user.id },
  });

  const userWithRole = { ...user, isAdmin: !!isAdmin };

  return (
    <TabWrapper>
      <SubmissionHeader challengeName={challengeName} />
      <SubmissionContentWrapper>
        <SubmissionMetadata submission={submission} user={userWithRole} />
        <PerformanceChart
          memoryUsages={memoryUsage}
          executionTimes={runtimes}
          currentMemory={Number(
            getMaxMemoryUsage(submission.testResults).split(" ").at(0),
          )}
          currentRuntime={Number(
            getMaxExecutionTime(submission.testResults).split(" ").at(0),
          )}
        />
        <SubmissionCode code={markdownCode} language={submission.language} />
      </SubmissionContentWrapper>
    </TabWrapper>
  );
};

export default SubmissionPage;
