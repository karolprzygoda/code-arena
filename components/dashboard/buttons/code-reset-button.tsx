import EditorButton from "@/components/dashboard/buttons/editor-button";
import { RotateCcw } from "lucide-react";
import { useEditorStore } from "@/lib/editorStore";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "zustand";

const CodeResetButton = () => {
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
      onClick={handleReset}
      tooltipMessage={"Reset code to default"}
      tooltipSide={"left"}
      Icon={RotateCcw}
    />
  );
};

export default CodeResetButton;
