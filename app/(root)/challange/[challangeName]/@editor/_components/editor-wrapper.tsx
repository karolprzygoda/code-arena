"use client";

import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import useDirection from "@/hooks/use-direction";
import { cn } from "@/lib/utils";
import { ResizablePanel } from "@/components/ui/resizable";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import { ReactNode } from "react";

type EditorWrapperProps = {
  children: ReactNode;
};

const EditorWrapper = ({ children }: EditorWrapperProps) => {
  const { layout } = usePreferencesStore(
    useShallow((state) => ({
      layout: state.layout,
    })),
  );

  const direction = useDirection();

  return (
    <ResizablePanel
      id={"editor-panel"}
      className={cn(
        "min-h-[114px]",
        layout === "classic" ? "order-3" : "order-1",
      )}
      order={layout === "classic" ? 2 : 1}
      defaultSize={50}
      minSize={direction === "horizontal" ? 30 : 0}
    >
      <PanelWrapper>{children}</PanelWrapper>
    </ResizablePanel>
  );
};

export default EditorWrapper;
