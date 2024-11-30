import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { BrainCircuit, FlaskConical, History, Text } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChallangeTabsProps = {
  isCollapsed: boolean;
  direction: "horizontal" | "vertical";
};

const ChallangeTabs = ({ isCollapsed, direction }: ChallangeTabsProps) => {
  return (
    <Tabs defaultValue="Description" className={cn("h-full @container/tabs")}>
      <TabsList
        className={cn(
          "grid h-auto w-full grid-cols-1 grid-rows-4 flex-wrap gap-1 rounded-b-none border-b border-zinc-300 py-2 outline-0 @[70px]/panel:grid-cols-2 @[70px]/panel:grid-rows-1 @[450px]/tabs:grid-cols-4 dark:border-zinc-700",
          isCollapsed && direction === "vertical" && "rounded-2xl border-0",
        )}
      >
        <ChallangeTabTrigger value={"Description"} Icon={Text} />
        <ChallangeTabTrigger value={"Solutions"} Icon={FlaskConical} />
        <ChallangeTabTrigger value={"Submissions"} Icon={History} />
        <ChallangeTabTrigger value={"AI Assistant"} Icon={BrainCircuit} />
      </TabsList>
      {!isCollapsed && (
        <>
          <ChallangeTabContentWrapper value={"Description"}>
            Description
          </ChallangeTabContentWrapper>
          <ChallangeTabContentWrapper value={"Solutions"}>
            Solutions
          </ChallangeTabContentWrapper>
          <ChallangeTabContentWrapper value={"Submissions"}>
            Submissions
          </ChallangeTabContentWrapper>
          <ChallangeTabContentWrapper value={"AI Assistant"}>
            Assistant
          </ChallangeTabContentWrapper>
        </>
      )}
    </Tabs>
  );
};

type ChallangeTabTriggerProps = {
  value: string;
  Icon: LucideIcon;
};

const ChallangeTabTrigger = ({ value, Icon }: ChallangeTabTriggerProps) => {
  return (
    <TabsTrigger
      className={
        "font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 @[70px]/panel:py-1.5 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
      }
      value={value}
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

type ChallangeTabContentWrapperProps = {
  value: string;
  children: string;
};

export const ChallangeTabContentWrapper = ({
  value,
  children,
}: ChallangeTabContentWrapperProps) => {
  return (
    <TabsContent
      value={value}
      className={"h-full w-full overflow-y-auto px-4 pb-36 pt-3 outline-none"}
    >
      {children}
    </TabsContent>
  );
};

export default ChallangeTabs;
