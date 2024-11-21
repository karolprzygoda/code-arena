import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import CodePanel from "@/components/dashboard/panels/code-panel";
import TestsPanel from "@/components/dashboard/panels/tests-panel";
import PanelFooter from "@/components/dashboard/panels/panel-footer";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";

const RightPanel = () => {
  return (
    <ResizablePanel defaultSize={50}>
      <PanelWrapper>
        <ResizablePanelGroup className={"rounded-2xl"} direction="vertical">
          <CodePanel />
          <ResizableHandle
            className={
              "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
            }
            withHandle
          />
          <TestsPanel>
            <span className="font-semibold">Tests</span>
          </TestsPanel>
          <PanelFooter>
            <div className={"flex items-center gap-4"}></div>
            <div className={"flex items-center justify-between gap-4"}>
              <Button className={"rounded-xl font-bold"}>Submit</Button>
            </div>
          </PanelFooter>
        </ResizablePanelGroup>
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default RightPanel;
