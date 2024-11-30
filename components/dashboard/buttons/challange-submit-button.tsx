"use client";

import { Button } from "@/components/ui/button";
import { testChallenge2 } from "@/actions/actions";
import { AvailableLanguages } from "@/lib/types";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";

const ChallangeSubmitButton = () => {
  const { value, language } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      language: state.language,
    })),
  );

  const handleSubmit = async (code: string, language: AvailableLanguages) => {
    const response = await testChallenge2(code);
    console.log(response);
  };

  return (
    <Button
      onClick={() => {
        void handleSubmit(value, language);
      }}
      className={"rounded-xl font-bold"}
    >
      Submit
    </Button>
  );
};

export default ChallangeSubmitButton;
