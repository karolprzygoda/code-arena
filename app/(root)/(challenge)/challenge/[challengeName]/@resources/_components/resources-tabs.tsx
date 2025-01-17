"use client";

import {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrainCircuit,
  FlaskConical,
  History,
  LucideIcon,
  Text,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useResourcesPanelStore } from "@/stores/resources-panel-store";
import { useShallow } from "zustand/react/shallow";

const POSSIBLE_TABS = ["solutions", "submissions", "ai-chatbot"];

type ResourcesTabsContentProps = {
  value: string;
  children: ReactNode;
};
const ResourcesTabsContent = ({
  value,
  children,
}: ResourcesTabsContentProps) => {
  return (
    <TabsContent
      value={value}
      tabIndex={-1}
      className={
        "relative m-0 w-full flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
      }
    >
      {children}
    </TabsContent>
  );
};

type ResourcesTabsTriggerProps = {
  value: string;
  Icon: LucideIcon;
} & ComponentPropsWithoutRef<"button">;

const ResourcesTabsTrigger = ({
  value,
  Icon,
  ...props
}: ResourcesTabsTriggerProps) => {
  return (
    <TabsTrigger
      aria-label={value.at(0)?.toUpperCase() + value.slice(1)}
      className={
        "font-semibold transition-colors duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 @[70px]/panel:py-1.5 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
      }
      value={value}
      {...props}
    >
      <span className={"hidden @[70px]/panel:inline"}>
        {value.at(0)?.toUpperCase() + value.slice(1)}
      </span>
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

type ResourcesTabsListProps = {
  children: ReactNode;
  isCollapsed: boolean;
  isDesktop: boolean;
};

const ResourcesTabsList = ({
  children,
  isCollapsed,
  isDesktop,
  ...props
}: ResourcesTabsListProps) => {
  return (
    <TabsList
      className={cn(
        "grid h-auto w-full grid-cols-1 grid-rows-4 flex-wrap gap-1 rounded-b-none border-b border-zinc-300 bg-white py-2 outline-0 @[70px]/panel:grid-cols-2 @[70px]/panel:grid-rows-1 @[450px]/tabs:grid-cols-4 dark:border-zinc-700 dark:bg-transparent",
        isCollapsed && !isDesktop && "rounded-2xl border-0",
      )}
      {...props}
    >
      {children}
    </TabsList>
  );
};

type ResourcesTabsProps = {
  children: ReactNode;
  challengeName: string;
  isDesktop: boolean;
  isCollapsed: boolean;
};

const ResourcesTabs = ({
  children,
  challengeName,
  isDesktop,
  isCollapsed,
}: ResourcesTabsProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const { resourcesResizablePanel } = useResourcesPanelStore(
    useShallow((state) => ({
      resourcesResizablePanel: state.resourcesResizablePanel,
    })),
  );

  const activeTab =
    POSSIBLE_TABS.find((item) => pathName.includes(item)) ?? "description";

  const handleTabChange = useCallback(
    (tab: string) => {
      const newPath =
        tab === "description"
          ? `/challenge/${challengeName}`
          : `/challenge/${challengeName}/${tab}`;

      router.push(newPath);
      resourcesResizablePanel!.expand(30);
    },
    [challengeName, resourcesResizablePanel, router],
  );

  useEffect(() => {
    const currentTab =
      POSSIBLE_TABS.find((item) => pathName.includes(item)) ?? "description";
    if (currentTab !== activeTab && resourcesResizablePanel) {
      handleTabChange(currentTab);
    }
  }, [activeTab, handleTabChange, pathName, resourcesResizablePanel]);

  return (
    <Tabs
      value={activeTab}
      className={cn("flex h-full flex-col @container/tabs")}
      onValueChange={handleTabChange}
    >
      <ResourcesTabsList isDesktop={isDesktop} isCollapsed={isCollapsed}>
        <ResourcesTabsTrigger value={"description"} Icon={Text} />
        <ResourcesTabsTrigger value={"solutions"} Icon={FlaskConical} />
        <ResourcesTabsTrigger value={"submissions"} Icon={History} />
        <ResourcesTabsTrigger value={"ai-chatbot"} Icon={BrainCircuit} />
      </ResourcesTabsList>
      {!isCollapsed && (
        <ResourcesTabsContent value={activeTab}>
          {children}
        </ResourcesTabsContent>
      )}
    </Tabs>
  );
};

export {
  ResourcesTabsContent,
  ResourcesTabsTrigger,
  ResourcesTabsList,
  ResourcesTabs,
};
