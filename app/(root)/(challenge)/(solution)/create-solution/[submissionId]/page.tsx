import ManageChallengePageWrapper from "@/app/(root)/(challenge)/_components/manage-challenge-page-wrapper";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/_components/form-components/challenge-description-viewer";
import MarkdownBuilder from "@/app/(root)/(challenge)/_components/form-components/markdown-builder";
import MarkdownStoreProvider from "@/stores/store-providers/markdown-store-provider";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PanelFooter from "@/app/(root)/(challenge)/_components/panel-footer";
import SubmitSolutionButton from "@/app/(root)/(challenge)/(solution)/_components/submit-solution-button";

type CreateSolutionPageParams = {
  params: Promise<{ submissionId: string }>;
};

const CreateSolutionPage = async ({ params }: CreateSolutionPageParams) => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sing-in");
  }

  const submission = await prismadb.submission.findFirst({
    where: {
      id: (await params).submissionId,
      status: "SUCCESS",
      userId: user.id,
    },
    include: {
      challenge: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  const markdown = `# Intuition

<!-- Describe your first thoughts on how to solve this problem. --> 
&nbsp; 

# Approach

<!-- Describe your approach to solving the problem. -->
&nbsp;  

# Complexity

- Time complexity:

<!-- Add your time complexity here, e.g. $$O(n)$$ --> 
- Space complexity:

<!-- Add your space complexity here, e.g. $$O(n)$$ --> 
&nbsp; 
# Code
\`\`\`${submission.language.toLowerCase()}
${submission.code}
\`\`\`
`;

  const userName = user.email?.split("@").at(0);

  return (
    <ManageChallengePageWrapper>
      <MarkdownStoreProvider markdown={markdown}>
        <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
          <ChallengeDescriptionViewer />
        </RootPanelWrapper>
        <div className={"relative lg:w-1/2"}>
          <MarkdownBuilder />
          <PanelFooter
            className={
              "absolute w-full justify-end rounded-b-2xl border border-zinc-300 backdrop-blur-sm dark:border-zinc-700 dark:bg-[#1e1e1e]/90"
            }
          >
            <SubmitSolutionButton
              initialData={{
                challengeId: submission.challengeId,
                description: markdown,
                language: submission.language,
                title: `${userName} solution.`,
              }}
              challengeTitle={submission.challenge.title}
            />
          </PanelFooter>
        </div>
      </MarkdownStoreProvider>
    </ManageChallengePageWrapper>
  );
};

export default CreateSolutionPage;
