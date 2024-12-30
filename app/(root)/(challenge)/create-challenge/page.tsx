import Link from "next/link";
import { Button } from "@/components/ui/button";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import CreateChallengeWrapper from "@/app/(root)/(challenge)/create-challenge/_components/create-challenge-wrapper";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/create-challenge/_components/challenge-description-viewer";
import CreateChallengeForm from "@/app/(root)/(challenge)/create-challenge/_components/create-challenge-form";

const CreateChallengePage = () => {
  return (
    <CreateChallengeWrapper>
      <RootPanelWrapper className={"min-h-full dark:bg-zinc-800 lg:w-1/2"}>
        <PanelHeader>
          <Link href={"/create-challenge/edit-description"}>
            <Button
              variant={"link"}
              className={"p-1 font-semibold"}
              size={"sm"}
            >
              Edit description
            </Button>
          </Link>
        </PanelHeader>
        <ChallengeDescriptionViewer />
      </RootPanelWrapper>
      <CreateChallengeForm />
    </CreateChallengeWrapper>
  );
};

export default CreateChallengePage;
