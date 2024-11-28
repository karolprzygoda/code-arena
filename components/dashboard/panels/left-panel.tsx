"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import PanelHeader from "@/components/dashboard/panels/panel-header";
import ChallangeNavigator from "@/components/dashboard/buttons/challange-navigator";
import ChallangeGroupLink from "@/components/dashboard/buttons/challange-group-link";
import ChallangeTabs from "@/components/dashboard/challange-tabs";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";
import useDirection from "@/hooks/use-direction";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const LeftPanel = () => {
  const direction = useDirection();

  const { layout } = usePreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const isBigScreen = useMediaQuery("(min-width: 1440px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ResizablePanel
      order={layout === "classic" ? 1 : 2}
      className={cn(
        "min-h-[87px] min-w-[68px] @container/panel min-[484px]:min-h-[51px]",
        layout === "classic" ? "order-1" : "order-3",
      )}
      minSize={direction === "horizontal" ? (isBigScreen ? 15 : 50) : 32}
      collapsible
      onCollapse={() => {
        setIsCollapsed(true);
      }}
      onExpand={() => {
        setIsCollapsed(false);
      }}
      defaultSize={50}
    >
      <PanelWrapper>
        <PanelHeader
          className={cn(isCollapsed && direction === "vertical" && "hidden")}
        >
          <ChallangeGroupLink href={"/"} name={"Challenges Group Name"} />
          <span className={"hidden gap-1 @[70px]/panel:flex"}>
            <ChallangeNavigator
              tooltipMessage={"Previous"}
              variant={"prev"}
              href={"/"}
            />
            <ChallangeNavigator
              tooltipMessage={"Next"}
              variant={"next"}
              href={"/"}
            />
          </span>
        </PanelHeader>
        <ChallangeTabs isCollapsed={isCollapsed} direction={direction} />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default LeftPanel;
