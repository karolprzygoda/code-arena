import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChallangeTabs = () => {
  return (
    <Tabs
      defaultValue="Description"
      className={"@[255px]:block @container/tabs hidden h-full"}
    >
      <TabsList
        className={
          "@[450px]/tabs:grid-cols-4 grid h-auto w-full grid-cols-2 flex-wrap gap-1 rounded-b-none border-b border-zinc-300 py-2 outline-0 dark:border-zinc-700"
        }
      >
        <ChallangeTabTrigger value={"Description"} />
        <ChallangeTabTrigger value={"Solutions"} />
        <ChallangeTabTrigger value={"Submissions"} />
        <ChallangeTabTrigger value={"AI Assistant"} />
      </TabsList>
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
    </Tabs>
  );
};

type ChallangeTabTriggerProps = {
  value: string;
};

const ChallangeTabTrigger = ({ value }: ChallangeTabTriggerProps) => {
  return (
    <TabsTrigger
      className={
        "px-4 py-1.5 font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
      }
      value={value}
    >
      {value}
    </TabsTrigger>
  );
};

type ChallangeTabContentWrapperProps = {
  value: string;
  children: string;
};

const ChallangeTabContentWrapper = ({
  value,
  children,
}: ChallangeTabContentWrapperProps) => {
  return (
    <TabsContent
      value={value}
      className={"h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"}
    >
      {children}
    </TabsContent>
  );
};

export default ChallangeTabs;
