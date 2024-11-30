"use client";

import useDirection from "@/hooks/use-direction";
import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";
import PanelHeader from "@/components/dashboard/panels/panel-header";
import ChallangeGroupLink from "@/components/dashboard/buttons/challange-group-link";
import ChallangeNavigator from "@/components/dashboard/buttons/challange-navigator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrainCircuit,
  FlaskConical,
  History,
  LucideIcon,
  Text,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { use } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ challangeName: string }>;
};

const Layout = ({ children, params }: LayoutProps) => {
  const direction = useDirection();

  const { challangeName } = use(params);

  const { layout } = usePreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const isBigScreen = useMediaQuery("(min-width: 1440px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const router = useRouter();

  const pathName = usePathname();

  const possible_tabs = ["solutions", "submissions", "ai-chatbot"];

  const activeTab =
    possible_tabs.find((item) => item === pathName.split("/").at(-1)) ??
    "description";

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

type TabContentWrapperProps = {
  value: string;
  children: ReactNode;
};
const TabContentWrapper = ({ value, children }: TabContentWrapperProps) => {
  return (
    <TabsContent
      value={value}
      className={"h-full w-full overflow-y-auto px-4 pb-36 pt-3 outline-none"}
    >
      {children}
    </TabsContent>
  );
};

type TabTriggerProps = {
  value: string;
  Icon: LucideIcon;
} & ComponentPropsWithoutRef<"button">;

const TabTrigger = ({ value, Icon, ...props }: TabTriggerProps) => {
  return (
    <TabsTrigger
      className={
        "font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 @[70px]/panel:py-1.5 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
      }
      value={value}
      {...props}
    >
      <span className={"hidden @[70px]/panel:inline"}>{value}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={"p-4 @[70px]/panel:hidden"}>
              <Icon className={"h-4 w-4"} />
            </span>
          </TooltipTrigger>
          <TooltipContent side={"right"}>
            <p className={"text-sm"}>{value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TabsTrigger>
  );
};

export default Layout;
