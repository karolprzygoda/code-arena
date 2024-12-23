"use client";

import { useFullScreen } from "@/hooks/use-full-screen";
import { useShallow } from "zustand/react/shallow";
import { Maximize2, Minimize2 } from "lucide-react";
import EditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/editor-button";
import { usePreferencesStore } from "@/stores/user-preferences-store";

type MaximizeEditorButtonProps = {
  label?: string;
  className?: string;
};

const MaximizeEditorButton = ({
  label,
  className,
}: MaximizeEditorButtonProps) => {
  const { fullScreenElement, setIsFullScreen, isFullScreen } =
    usePreferencesStore(
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
      className={className}
      onClick={toggleFullScreen}
      tooltipMessage={"Maximize editor"}
      Icon={isFullScreen ? Minimize2 : Maximize2}
      label={label}
    />
  );
};

export default MaximizeEditorButton;
