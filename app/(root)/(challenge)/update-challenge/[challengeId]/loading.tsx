import ManageChallengePageWrapper from "@/app/(root)/(challenge)/_components/manage-challenge-page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";

const Loading = () => {
  return (
    <ManageChallengePageWrapper>
      <RootPanelWrapper>
        <Skeleton className={"h-full w-full"} />
      </RootPanelWrapper>
      <RootPanelWrapper>
        <Skeleton className={"h-full w-full"} />
      </RootPanelWrapper>
    </ManageChallengePageWrapper>
  );
};

export default Loading;
