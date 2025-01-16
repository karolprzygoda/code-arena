import ManageChallengePageWrapper from "@/app/(root)/(challenge)/(manage-challenge)/_components/manage-challenge-page-wrapper";

import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import { Icons } from "@/components/icons";

const Loading = () => {
  return (
    <ManageChallengePageWrapper>
      <RootPanelWrapper className={"relative dark:bg-zinc-800"}>
        <div
          className={
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }
        >
          <Icons.loadingSpinner />
        </div>
      </RootPanelWrapper>
      <RootPanelWrapper className={"relative"}>
        <div
          className={
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }
        >
          <Icons.loadingSpinner />
        </div>
      </RootPanelWrapper>
    </ManageChallengePageWrapper>
  );
};

export default Loading;
