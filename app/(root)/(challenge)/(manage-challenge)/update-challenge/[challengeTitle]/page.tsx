import ManageChallengePageWrapper from "@/app/(root)/(challenge)/(manage-challenge)/_components/manage-challenge-page-wrapper";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import SwitchFormFieldsButton from "@/app/(root)/(challenge)/(manage-challenge)/_components/switch-form-fields-button";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/(manage-challenge)/_components/challenge-description-viewer";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import MarkdownStoreProvider from "@/stores/store-providers/markdown-store-provider";
import { fromKebabCaseToPascalCase, stringifyTestCases } from "@/lib/utils";
import ChallengeForm from "@/app/(root)/(challenge)/(manage-challenge)/_components/challenge-form";

export async function generateStaticParams() {
  const challenges = await prismadb.challenge.findMany({
    select: {
      title: true,
    },
  });
  return challenges.map((challenge) => ({
    challengeTitle: challenge.title,
  }));
}

type UpdateChallengePageParams = {
  params: Promise<{ challengeTitle: string }>;
};

const UpdateChallengePage = async ({ params }: UpdateChallengePageParams) => {
  const challengeTitle = (await params).challengeTitle;

  const challengeData = await prismadb.challenge.findFirst({
    where: {
      title: challengeTitle,
    },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      testCases: true,
      descriptionSnippet: true,
    },
  });

  if (!challengeData) {
    notFound();
  }

  const stringifiedTests = stringifyTestCases(challengeData.testCases);

  const title = fromKebabCaseToPascalCase(challengeData.title);

  const sanitizedChallengeData = {
    ...challengeData,
    title,
    testCases: stringifiedTests,
  };

  return (
    <ManageChallengePageWrapper>
      <MarkdownStoreProvider markdown={challengeData.description}>
        <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
          <PanelHeader>
            <SwitchFormFieldsButton />
          </PanelHeader>
          <ChallengeDescriptionViewer />
        </RootPanelWrapper>
        <ChallengeForm
          initialData={sanitizedChallengeData}
          challengeId={challengeData.id}
        />
      </MarkdownStoreProvider>
    </ManageChallengePageWrapper>
  );
};

export default UpdateChallengePage;
