"use client";
import { Button } from "@/components/ui/button";
import { useChallengeFormStore } from "@/stores/challenge-form-store";
import { useShallow } from "zustand/react/shallow";

const SwitchFormFieldsButton = () => {
  const { isEditingDescription, setIsEditingDescription } =
    useChallengeFormStore(
      useShallow((state) => ({
        isEditingDescription: state.isEditingDescription,
        setIsEditingDescription: state.setIsEditingDescription,
      })),
    );

  const handleToggleMode = () => {
    setIsEditingDescription(!isEditingDescription);
  };

  return (
    <Button
      variant={"link"}
      className={"p-1 font-semibold"}
      size={"sm"}
      onClick={handleToggleMode}
    >
      {isEditingDescription ? "Go back to form" : "Edit description"}
    </Button>
  );
};

export default SwitchFormFieldsButton;
