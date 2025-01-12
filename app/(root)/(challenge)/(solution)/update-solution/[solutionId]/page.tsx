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

type UpdateSolutionPageParams = {
  params: Promise<{ solutionId: string }>;
};

const UpdateSolutionPage = async ({ params }: UpdateSolutionPageParams) => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/sing-in");
  }

  const solution = await prismadb.solution.findFirst({
    where: {
      id: (await params).solutionId,
      authorId: user.id,
    },
    include: {
      challenge: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!solution) {
    notFound();
  }

  return (
    <ManageChallengePageWrapper>
      <MarkdownStoreProvider markdown={solution.description}>
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
                challengeId: solution.challengeId,
                description: solution.description,
                language: solution.language,
                title: solution.title,
              }}
              challengeTitle={solution.challenge.title}
              solutionId={solution.id}
            />
          </PanelFooter>
        </div>
      </MarkdownStoreProvider>
    </ManageChallengePageWrapper>
  );
};

export default UpdateSolutionPage;
