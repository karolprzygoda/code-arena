import ManageChallengePageWrapper from "@/app/(root)/(challenge)/_components/manage-challenge-page-wrapper";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import SwitchFormFieldsButton from "@/app/(root)/(challenge)/_components/form-components/switch-form-fields-button";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/_components/form-components/challenge-description-viewer";
import ChallengeForm from "@/app/(root)/(challenge)/_components/form-components/challenge-form";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

type UpdateChallengePageParams = {
  params: Promise<{ challengeId: string }>;
};

const UpdateChallengePage = async ({ params }: UpdateChallengePageParams) => {
  const challengeId = (await params).challengeId;

  const challengeData = await prismadb.challenge.findFirst({
    where: {
      id: challengeId,
    },
    select: {
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

  const stringifiedTests = challengeData.testCases.map((testCase) => ({
    ...testCase,
    expectedOutput: JSON.stringify(testCase.expectedOutput),
    inputs: testCase.inputs.map((input) => ({
      ...input,
      value: JSON.stringify(input.value),
    })),
  }));

  const title = challengeData.title
    .split("-")
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join(" ");

  const sanitizedChallengeData = {
    ...challengeData,
    title,
    testCases: stringifiedTests,
  };

  return (
    <ManageChallengePageWrapper>
      <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
        <PanelHeader>
          <SwitchFormFieldsButton />
        </PanelHeader>
        <ChallengeDescriptionViewer />
      </RootPanelWrapper>
      <ChallengeForm
        initialData={sanitizedChallengeData}
        challengeId={challengeId}
      />
    </ManageChallengePageWrapper>
  );
};

export default UpdateChallengePage;
