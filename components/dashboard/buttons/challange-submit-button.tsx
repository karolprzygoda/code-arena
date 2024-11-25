"use client";

import { Button } from "@/components/ui/button";
import { testChallenge } from "@/lib/actions/actions";
import { AvailableLanguages } from "@/lib/types";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/lib/stores/editorStore";
import { useShallow } from "zustand/react/shallow";

const ChallangeSubmitButton = () => {
  const { value, defaultLanguage } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      defaultLanguage: state.defaultLanguage,
    })),
  );

  const handleSubmit = async (code: string, language: AvailableLanguages) => {
    const response = await testChallenge(code);
    console.log(response);
  };

  return (
    <Button
      onClick={() => {
        void handleSubmit(value, defaultLanguage);
      }}
      className={"rounded-xl font-bold"}
    >
      Submit
    </Button>
  );
};

export default ChallangeSubmitButton;
