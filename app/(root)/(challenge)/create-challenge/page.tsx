import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import ManageChallengePageWrapper from "@/app/(root)/(challenge)/_components/manage-challenge-page-wrapper";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/_components/form-components/challenge-description-viewer";
import SwitchFormFieldsButton from "@/app/(root)/(challenge)/_components/form-components/switch-form-fields-button";
import MarkdownStoreProvider from "@/stores/store-providers/markdown-store-provider";
import ChallengeFormWrapper from "@/app/(root)/(challenge)/_components/form-components/challenge-form-wrapper";

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
        <ChallengeFormWrapper />
      </MarkdownStoreProvider>
    </ManageChallengePageWrapper>
  );
};

export default CreateChallengePage;
