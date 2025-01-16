"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ResizablePanel } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import MoreChallengesSheet from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/more-challenges-sheet";
import ChallengeNavigator from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/challenge-navigator";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import { ResourcesTabs } from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/resources-tabs";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import { useResourcesPanelStore } from "@/stores/resources-panel-store";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Challenge } from "@prisma/client";

type ResourcesWrapperProps = {
  children: ReactNode;
  challengeName: string;
  challenges: Array<Pick<Challenge, "difficulty" | "title">>;
};

const ResourcesWrapper = ({
  children,
  challengeName,
  challenges,
}: ResourcesWrapperProps) => {
  const { layout } = useUserPreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const resourcesPanelRef = useRef<ImperativePanelHandle>(null);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isBigScreen = useMediaQuery("(min-width: 1440px)");

  const { isCollapsed, setIsCollapsed, setResourcesResizablePanel } =
    useResourcesPanelStore(
      useShallow((state) => ({
        isCollapsed: state.isCollapsed,
        setIsCollapsed: state.setIsCollapsed,
        setResourcesResizablePanel: state.setResourcesResizablePanel,
      })),
    );

  useLayoutEffect(() => {
    if (resourcesPanelRef.current) {
      setResourcesResizablePanel(resourcesPanelRef.current);
    }
  }, [setResourcesResizablePanel, resourcesPanelRef]);

  return (
    <ResizablePanel
      id={"resources-panel"}
      order={layout === "classic" ? 1 : 2}
      className={cn(
        "min-h-[87px] min-w-[68px] overflow-hidden @container/panel min-[484px]:min-h-[51px]",
        layout === "classic" ? "order-1" : "order-3",
      )}
      minSize={isDesktop ? (isBigScreen ? 15 : 50) : 32}
      collapsible
      ref={resourcesPanelRef}
      onCollapse={() => setIsCollapsed(true)}
      onExpand={() => setIsCollapsed(false)}
      defaultSize={50}
    >
      <RootPanelWrapper className={"dark:bg-zinc-800"}>
        <PanelHeader
          className={cn("px-1", isCollapsed && !isDesktop && "hidden")}
        >
          <MoreChallengesSheet challenges={challenges} />
          <span className={"hidden gap-1 @[70px]/panel:flex"}>
            <ChallengeNavigator
              tooltipMessage={"Previous"}
              variant={"prev"}
              href={"/"}
            />
            <ChallengeNavigator
              tooltipMessage={"Next"}
              variant={"next"}
              href={"/"}
            />
          </span>
        </PanelHeader>
        <ResourcesTabs
          isDesktop={isDesktop}
          isCollapsed={isCollapsed}
          challengeName={challengeName}
        >
          {children}
        </ResourcesTabs>
      </RootPanelWrapper>
    </ResizablePanel>
  );
};

export default ResourcesWrapper;
