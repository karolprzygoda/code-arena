"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useEffect, useRef } from "react";
import useDirection from "@/hooks/use-direction";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";

type DashBoardWrapper = {
  children: ReactNode;
};

const DashBoardWrapper = ({ children }: DashBoardWrapper) => {
  const direction = useDirection();
  const dashboard = useRef(null);
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);

  const { setFullScreenElement, isFullScreen } = usePreferencesStore(
    useShallow((state) => ({
      setFullScreenElement: state.setFullScreenElement,
      isFullScreen: state.isFullScreen,
    })),
  );

  useEffect(() => {
    if (hasHydrated && dashboard.current) {
      setFullScreenElement(dashboard.current);
    }
  }, [hasHydrated, setFullScreenElement]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div
      ref={dashboard}
      className={cn(
        "flex h-full flex-1 bg-background px-4 pb-4",
        isFullScreen && "pt-4",
      )}
    >
      <ResizablePanelGroup
        autoSaveId="persistence"
        direction={direction}
        className="flex flex-1"
      >
        {children}
      </ResizablePanelGroup>
    </div>
  );
};

export default DashBoardWrapper;
