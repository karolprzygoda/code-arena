import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import ManageChallengePageWrapper from "@/app/(root)/(challenge)/_components/manage-challenge-page-wrapper";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/_components/form-components/challenge-description-viewer";
import ChallengeForm from "@/app/(root)/(challenge)/_components/form-components/challenge-form";
import SwitchFormFieldsButton from "@/app/(root)/(challenge)/_components/form-components/switch-form-fields-button";

const CreateChallengePage = () => {
  return (
    <ManageChallengePageWrapper>
      <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
        <PanelHeader>
          <SwitchFormFieldsButton />
        </PanelHeader>
        <ChallengeDescriptionViewer />
      </RootPanelWrapper>
      <ChallengeForm />
    </ManageChallengePageWrapper>
  );
};

export default CreateChallengePage;
