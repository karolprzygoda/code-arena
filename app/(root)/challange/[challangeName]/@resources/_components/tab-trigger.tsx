import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TabTriggerProps = {
  value: string;
  Icon: LucideIcon;
} & ComponentPropsWithoutRef<"button">;

const TabTrigger = ({ value, Icon, ...props }: TabTriggerProps) => {
  return (
    <TabsTrigger
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

export default TabTrigger;
