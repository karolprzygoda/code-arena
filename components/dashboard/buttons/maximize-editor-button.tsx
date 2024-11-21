"use client";

import { useFullScreen } from "@/hooks/use-full-screen";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useShallow } from "zustand/react/shallow";
import { Maximize2, Minimize2 } from "lucide-react";
import EditorButton from "@/components/dashboard/buttons/editor-button";

const MaximizeEditorButton = () => {
  const { fullScreenElement, setIsFullScreen, isFullScreen } =
    useDashboardStore(
      useShallow((state) => ({
        fullScreenElement: state.fullScreenElement,
        setIsFullScreen: state.setIsFullScreen,
        isFullScreen: state.isFullScreen,
      })),
    );

  const { toggleFullScreen } = useFullScreen(
    fullScreenElement,
    setIsFullScreen,
  );

  return (
    <EditorButton
      onClick={toggleFullScreen}
      tooltipMessage={"Maximize editor"}
      Icon={isFullScreen ? Minimize2 : Maximize2}
    />
  );
};

export default MaximizeEditorButton;
