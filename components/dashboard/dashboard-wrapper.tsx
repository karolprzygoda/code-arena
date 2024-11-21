"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useEffect, useRef } from "react";
import useDirection from "@/hooks/use-direction";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

type DashBoardWrapper = {
  children: ReactNode;
};

const DashBoardWrapper = ({ children }: DashBoardWrapper) => {
  const direction = useDirection();
  const dashboard = useRef(null);

  const { setFullScreenElement, isFullScreen } = useDashboardStore(
    useShallow((state) => ({
      setFullScreenElement: state.setFullScreenElement,
      isFullScreen: state.isFullScreen,
    })),
  );

  useEffect(() => {
    setFullScreenElement(dashboard.current!);
  }, [setFullScreenElement]);

  return (
    <div
      ref={dashboard}
      className={cn("flex flex-1 px-4 pb-4", isFullScreen && "pt-4")}
    >
      <ResizablePanelGroup direction={direction} className="flex flex-1">
        {children}
      </ResizablePanelGroup>
    </div>
  );
};

export default DashBoardWrapper;
