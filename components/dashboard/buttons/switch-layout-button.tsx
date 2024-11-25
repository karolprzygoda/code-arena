"use client";

import { useDashboardStore } from "@/lib/stores/dashboard-store";
import { useShallow } from "zustand/react/shallow";
import { ArrowRightLeft } from "lucide-react";
import EditorButton from "@/components/dashboard/buttons/editor-button";

const SwitchLayoutButton = () => {
  const { toggleLayout } = useDashboardStore(
    useShallow((state) => ({
      toggleLayout: state.toggleLayout,
    })),
  );

  return (
    <EditorButton
      onClick={toggleLayout}
      tooltipMessage={"Swap panels"}
      Icon={ArrowRightLeft}
    />
  );
};

export default SwitchLayoutButton;
