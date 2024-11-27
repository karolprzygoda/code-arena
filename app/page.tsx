import { ResizableHandle } from "@/components/ui/resizable";
import LeftPanel from "@/components/dashboard/panels/left-panel";
import RightPanel from "@/components/dashboard/panels/right-panel";
import DashBoardWrapper from "@/components/dashboard/dashboard-wrapper";

export default function ChallangePage() {
  return (
    <DashBoardWrapper>
      <LeftPanel />
      <ResizableHandle
        className={"group order-2 bg-background p-2"}
        withHandle
      />
      <RightPanel />
    </DashBoardWrapper>
  );
}
