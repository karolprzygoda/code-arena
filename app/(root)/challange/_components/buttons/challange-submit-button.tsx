"use client";

import { Button } from "@/components/ui/button";
import { testChallenge3 } from "@/actions/actions";
import { AvailableLanguages } from "@/lib/types";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";

const ChallangeSubmitButton = () => {
  const { value, language } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      language: state.language,
    })),
  );

  const handleSubmit = async (code: string, language: AvailableLanguages) => {
    const response = await testChallenge3(code);
    console.log(response);
    if (!response.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Your code successfully passed all tests.",
      });
    }
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
