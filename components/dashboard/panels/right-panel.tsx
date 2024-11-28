"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CodePanel from "@/components/dashboard/panels/code-panel";
import TestsPanel from "@/components/dashboard/panels/tests-panel";
import PanelFooter from "@/components/dashboard/panels/panel-footer";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";
import ChallangeSubmitButton from "@/components/dashboard/buttons/challange-submit-button";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import useDirection from "@/hooks/use-direction";
import PanelHeader from "@/components/dashboard/panels/panel-header";
import ChooseLanguageButton from "@/components/dashboard/buttons/choose-language-button";
import CodeResetButton from "@/components/dashboard/buttons/code-reset-button";
import ShortcutButton from "@/components/dashboard/buttons/shortcut-button";
import SettingsButton from "@/components/dashboard/buttons/settings-button";
import SwitchLayoutButton from "@/components/dashboard/buttons/switch-layout-button";
import MaximizeEditorButton from "@/components/dashboard/buttons/maximize-editor-button";
import MobileEditorSettings from "@/components/dashboard/mobile-editor-settings";
import { usePreferencesStore } from "@/stores/user-preferences-store";

const RightPanel = () => {
  const { layout } = usePreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const direction = useDirection();

  return (
    <ResizablePanel
      className={cn(
        "min-h-[114px]",
        layout === "classic" ? "order-3" : "order-1",
      )}
      order={layout === "classic" ? 2 : 1}
      defaultSize={50}
      minSize={direction === "horizontal" ? 30 : 0}
    >
      <PanelWrapper>
        <ResizablePanelGroup className={"rounded-2xl"} direction="vertical">
          <PanelHeader className={"justify-between px-3 dark:bg-[#1e1e1e]"}>
            <ChooseLanguageButton />
            <div className={"hidden gap-4 sm:flex"}>
              <CodeResetButton />
              <ShortcutButton />
              <SettingsButton />
              <SwitchLayoutButton />
              <MaximizeEditorButton />
            </div>
            <MobileEditorSettings />
          </PanelHeader>
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
              <ChallangeSubmitButton />
            </div>
          </PanelFooter>
        </ResizablePanelGroup>
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default RightPanel;
