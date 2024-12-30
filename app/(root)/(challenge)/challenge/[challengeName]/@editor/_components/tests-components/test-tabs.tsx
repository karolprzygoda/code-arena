import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

type TestTabsProps = {
  children: ReactNode;
  defaultValue: string;
};

const TestTabs = ({ children, defaultValue }: TestTabsProps) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      orientation={"vertical"}
      className="flex h-full w-full p-0"
    >
      {children}
    </Tabs>
  );
};

type TestTabsListProps = {
  children: ReactNode;
};

const TestTabsList = ({ children }: TestTabsListProps) => {
  return (
    <TabsList
      className={
        "flex h-full flex-col items-start justify-start bg-transparent p-0"
      }
    >
      {children}
    </TabsList>
  );
};

type TestTabTriggerProps = {
  value: string;
  children: ReactNode;
  notification?: boolean;
};

const TestTabTrigger = ({ value, children }: TestTabTriggerProps) => {
  return (
    <TabsTrigger
      className={
        "h-10 w-36 justify-start rounded-none border-b border-r bg-transparent font-semibold !transition-none last:border-b-0 hover:underline data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
      }
      value={value}
    >
      <span className={"relative"}>{children}</span>
    </TabsTrigger>
  );
};

type TestTabsContentProps = {
  children: ReactNode;
  value: string;
};

const TestTabsContent = ({ children, value }: TestTabsContentProps) => {
  return (
    <TabsContent
      className={"scrollbar-thin m-0 w-full overflow-y-auto"}
      value={value}
    >
      {children}
    </TabsContent>
  );
};

export { TestTabs, TestTabsList, TestTabTrigger, TestTabsContent };
