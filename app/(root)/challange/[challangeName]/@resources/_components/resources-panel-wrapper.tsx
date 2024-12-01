"use client";

import { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { useMediaQuery } from "@/hooks/use-media-query";
import useDirection from "@/hooks/use-direction";

import { ResizablePanel } from "@/components/ui/resizable";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import ChallangeGroupLink from "@/app/(root)/challange/_components/buttons/challange-group-link";
import ChallangeNavigator from "@/app/(root)/challange/_components/buttons/challange-navigator";
import TabTrigger from "@/app/(root)/challange/[challangeName]/@resources/_components/tab-trigger";
import TabContentWrapper from "@/app/(root)/challange/[challangeName]/@resources/_components/tab-content-wrapper";

import { BrainCircuit, FlaskConical, History, Text } from "lucide-react";

type ResourcesPanelWrapperProps = {
  children: ReactNode;
  challangeName: string;
};

const ResourcesPanelWrapper = ({
  children,
  challangeName,
}: ResourcesPanelWrapperProps) => {
  const direction = useDirection();
  const router = useRouter();
  const pathName = usePathname();

  const { layout } = usePreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const isBigScreen = useMediaQuery("(min-width: 1440px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const possible_tabs = ["solutions", "submissions", "ai-chatbot"];

  const activeTab =
    possible_tabs.find((item) => item === pathName.split("/").at(-1)) ??
    "description";

  return (
    <ResizablePanel
      id={"resources-panel"}
      order={layout === "classic" ? 1 : 2}
      className={cn(
        "min-h-[87px] min-w-[68px] @container/panel min-[484px]:min-h-[51px]",
        layout === "classic" ? "order-1" : "order-3",
      )}
      minSize={direction === "horizontal" ? (isBigScreen ? 15 : 50) : 32}
      collapsible
      onCollapse={() => setIsCollapsed(true)}
      onExpand={() => setIsCollapsed(false)}
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
        <Tabs defaultValue={activeTab} className={cn("h-full @container/tabs")}>
          <TabsList
            className={cn(
              "grid h-auto w-full grid-cols-1 grid-rows-4 flex-wrap gap-1 rounded-b-none border-b border-zinc-300 py-2 outline-0 @[70px]/panel:grid-cols-2 @[70px]/panel:grid-rows-1 @[450px]/tabs:grid-cols-4 dark:border-zinc-700",
              isCollapsed && direction === "vertical" && "rounded-2xl border-0",
            )}
          >
            <TabTrigger
              onClick={() => router.push(`/challange/${challangeName}`)}
              value={"description"}
              Icon={Text}
            />
            <TabTrigger
              onClick={() =>
                router.push(`/challange/${challangeName}/solutions`)
              }
              value={"solutions"}
              Icon={FlaskConical}
            />
            <TabTrigger
              onClick={() =>
                router.push(`/challange/${challangeName}/submissions`)
              }
              value={"submissions"}
              Icon={History}
            />
            <TabTrigger
              onClick={() =>
                router.push(`/challange/${challangeName}/ai-chatbot`)
              }
              value={"ai-chatbot"}
              Icon={BrainCircuit}
            />
          </TabsList>
          {!isCollapsed && (
            <TabContentWrapper value={activeTab}>{children}</TabContentWrapper>
          )}
        </Tabs>
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default ResourcesPanelWrapper;
