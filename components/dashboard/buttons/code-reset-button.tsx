import EditorButton from "@/components/dashboard/buttons/editor-button";
import { RotateCcw } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "zustand";

type CodeResetButtonProps = {
  label?: string;
  className?: string;
};

const CodeResetButton = ({ label, className }: CodeResetButtonProps) => {
  const { defaultValue, setValue } = useStore(
    useEditorStore,
    useShallow((state) => ({
      defaultValue: state.defaultValue,
      setValue: state.setValue,
    })),
  );

  const handleReset = () => {
    setValue(defaultValue);
  };

  return (
    <EditorButton
      className={className}
      onClick={handleReset}
      tooltipMessage={"Reset code to default"}
      tooltipSide={"left"}
      Icon={RotateCcw}
      label={label}
    />
  );
};

export default CodeResetButton;
