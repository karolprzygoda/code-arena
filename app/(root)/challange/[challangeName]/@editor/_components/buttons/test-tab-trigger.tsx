"use client";

import { TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { useTestResultsStore } from "@/stores/tests-results-store";

type TestTabTriggerProps = {
  value: string;
  children: ReactNode;
  notification?: boolean;
};

const TestTabTrigger = ({
  value,
  children,
  notification,
}: TestTabTriggerProps) => {
  const [visited, setVisited] = useState(false);
  const { testsResults } = useTestResultsStore(
    useShallow((state) => ({
      testsResults: state.testsResults,
    })),
  );

  useEffect(() => {
    setVisited(false);
  }, [testsResults]);

  return (
    <TabsTrigger
      className={
        "h-10 w-36 justify-start rounded-none border-b border-r bg-transparent font-semibold last:border-b-0 data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
      }
      value={value}
      onClick={() => setVisited(true)}
    >
      <span className={"relative"}>
        {children}
        {notification && (
          <div
            className={cn(
              "absolute -right-3 top-0 h-2 w-2 rounded-full",
              visited ? "bg-neutral-500" : "bg-orange-500",
            )}
          ></div>
        )}
      </span>
    </TabsTrigger>
  );
};

export default TestTabTrigger;
