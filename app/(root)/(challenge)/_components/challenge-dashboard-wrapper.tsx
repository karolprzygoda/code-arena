"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/use-media-query";

type ChallengeWrapperProps = {
  children: ReactNode;
};

const ChallengeDashboardWrapper = ({ children }: ChallengeWrapperProps) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { setFullScreenElement, isFullScreen } = useUserPreferencesStore(
    useShallow((state) => ({
      setFullScreenElement: state.setFullScreenElement,
      isFullScreen: state.isFullScreen,
    })),
  );

  useEffect(() => {
    if (hasHydrated && dashboardRef.current) {
      setFullScreenElement(dashboardRef.current);
    }
  }, [hasHydrated, setFullScreenElement]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div
      ref={dashboardRef}
      className={cn("absolute h-full w-full", isFullScreen && "p-4")}
    >
      <ResizablePanelGroup
        autoSaveId="persistence"
        direction={isDesktop ? "horizontal" : "vertical"}
        className="flex flex-1"
      >
        {children}
      </ResizablePanelGroup>
    </div>
  );
};

export default ChallengeDashboardWrapper;
