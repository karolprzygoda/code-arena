"use client";

import { Button } from "@/components/ui/button";
import { testChallenge3 } from "@/actions/actions";
import { AvailableLanguages, Test } from "@/lib/types";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";
import { useTestResultsStore } from "@/stores/tests-results-store";

type ChallangeSubmitButtonProps = {
  tests: Test[];
};

const ChallangeSubmitButton = ({ tests }: ChallangeSubmitButtonProps) => {
  const { value, language } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      language: state.language,
    })),
  );

  const { setTestsResults, setGlobalError } = useStore(
    useTestResultsStore,
    useShallow((state) => ({
      setTestsResults: state.setTestsResults,
      setGlobalError: state.setGlobalError,
    })),
  );

  const handleSubmit = async (
    code: string,
    tests: Test[],
    language: AvailableLanguages,
  ) => {
    const response = await testChallenge3(code, tests);
    if (!response.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error.message,
      });
      setGlobalError(response.error);
    } else {
      if (response.results.find((result) => !result.passed)) {
        toast({
          title: "Failure",
          description: "Your code do not successfully passed all tests.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your code successfully passed all tests.",
        });
      }
      setTestsResults(response.results);
      setGlobalError(null);
    }
  };

  return (
    <Button
      onClick={() => {
        void handleSubmit(value, tests, language);
      }}
      className={"rounded-xl font-bold"}
    >
      Submit
    </Button>
  );
};

export default ChallangeSubmitButton;
