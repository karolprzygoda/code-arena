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

const LeftPanel = () => {
  const direction = useDirection();
  const { layout } = usePreferencesStore(
    useShallow((state) => ({ layout: state.layout })),
  );

  return (
    <ResizablePanel
      order={layout === "classic" ? 1 : 2}
      className={cn(
        "@container min-h-[40px] min-w-[90px]",
        layout === "classic" ? "order-1" : "order-3",
      )}
      minSize={direction === "horizontal" ? 15 : 32}
      collapsible
      defaultSize={50}
    >
      <PanelWrapper>
        <PanelHeader
          className={direction === "horizontal" ? "@[255px]:flex hidden" : ""}
        >
          <ChallangeGroupLink href={"/"} name={"Challenges Group Name"} />
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
        </PanelHeader>
        <ChallangeTabs />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default LeftPanel;
