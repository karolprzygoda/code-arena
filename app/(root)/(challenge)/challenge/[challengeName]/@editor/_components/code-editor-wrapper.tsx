"use client";

import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { ResizablePanel } from "@/components/ui/resizable";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type CodeEditorWrapperProps = {
  children: ReactNode;
};

const CodeEditorWrapper = ({ children }: CodeEditorWrapperProps) => {
  const { layout } = useUserPreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <ResizablePanel
      id={"editor-panel"}
      className={cn(
        "min-h-[114px] rounded-2xl dark:bg-[#1e1e1e]",
        layout === "classic" ? "order-3" : "order-1",
      )}
      order={layout === "classic" ? 2 : 1}
      defaultSize={50}
      minSize={isDesktop ? 30 : 0}
    >
      <RootPanelWrapper>{children}</RootPanelWrapper>
    </ResizablePanel>
  );
};

export default CodeEditorWrapper;
