import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import ManageChallengePageWrapper from "@/app/(root)/(challenge)/(manage-challenge)/_components/manage-challenge-page-wrapper";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/(manage-challenge)/_components/challenge-description-viewer";
import SwitchFormFieldsButton from "@/app/(root)/(challenge)/(manage-challenge)/_components/switch-form-fields-button";
import MarkdownStoreProvider from "@/stores/store-providers/markdown-store-provider";
import ChallengeForm from "@/app/(root)/(challenge)/(manage-challenge)/_components/challenge-form";

const CreateChallengePage = () => {
  return (
    <ManageChallengePageWrapper>
      <MarkdownStoreProvider markdown={""}>
        <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
          <PanelHeader>
            <SwitchFormFieldsButton />
          </PanelHeader>
          <ChallengeDescriptionViewer />
        </RootPanelWrapper>
        <ChallengeForm />
      </MarkdownStoreProvider>
    </ManageChallengePageWrapper>
  );
};

export default CreateChallengePage;
