"use client";

import { ResizableHandle } from "@/components/ui/resizable";
import LeftPanel from "@/components/dashboard/panels/left-panel";
import RightPanel from "@/components/dashboard/panels/right-panel";
import DashBoardWrapper from "@/components/dashboard/dashboard-wrapper";
import { useDashboardStore } from "@/lib/stores/dashboard-store";
import { useShallow } from "zustand/react/shallow";

export default function ChallangePage() {
  const getPanelOrder = (layout: "classic" | "reversed") =>
    layout === "classic"
      ? [<LeftPanel key={"left-panel"} />, <RightPanel key={"right-panel"} />]
      : [<RightPanel key={"right-panel"} />, <LeftPanel key={"left-panel"} />];

  const { layout } = useDashboardStore(
    useShallow((state) => ({ layout: state.layout })),
  );

  const panelOrder = getPanelOrder(layout);

  return (
    <DashBoardWrapper>
      {panelOrder[0]}
      <ResizableHandle className={"group bg-background p-2"} withHandle />
      {panelOrder[1]}
    </DashBoardWrapper>
  );
}
