"use client";

import { useShallow } from "zustand/react/shallow";
import { ArrowRightLeft } from "lucide-react";
import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import { usePreferencesStore } from "@/stores/user-preferences-store";

type SwitchLayoutButtonProps = {
  label?: string;
  className?: string;
};

const SwitchLayoutButton = ({ label, className }: SwitchLayoutButtonProps) => {
  const { toggleLayout } = usePreferencesStore(
    useShallow((state) => ({
      toggleLayout: state.toggleLayout,
    })),
  );

  return (
    <EditorButton
      className={className}
      onClick={toggleLayout}
      tooltipMessage={"Swap panels"}
      Icon={ArrowRightLeft}
      label={label}
      title={"Swap panels"}
    />
  );
};

export default SwitchLayoutButton;
