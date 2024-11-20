import { ResizableHandle } from "@/components/ui/resizable";
import LeftPanel from "@/components/dashboard/left-panel";
import RightPanel from "@/components/dashboard/right-panel";
import DashBoardWrapper from "@/components/dashboard/dashboard-wrapper";

export default function ChallangePage() {
  return (
    <DashBoardWrapper>
      <LeftPanel />
      <ResizableHandle className={"group bg-background p-2"} withHandle />
      <RightPanel />
    </DashBoardWrapper>
  );
}
