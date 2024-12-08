"use client";

import { Button } from "@/components/ui/button";
import { testChallenge } from "@/actions/actions";
import { AvailableLanguages, TestResult } from "@/lib/types";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { Language } from "@prisma/client";

type ChallangeSubmitButtonProps = {
  challangeId: string;
};

const ChallangeSubmitButton = ({ challangeId }: ChallangeSubmitButtonProps) => {
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

  const handleSubmit = async (code: string, language: AvailableLanguages) => {
    try {
      const response = await testChallenge(
        code,
        language.toUpperCase() as Language,
        challangeId,
      );

      setTestsResults(response.testResults as TestResult[]);

      if (response.status === "FAIL") {
        toast({
          variant: "destructive",
          title: "Uh oh! You still have errors.",
        });
      } else {
        toast({
          title: "All tests passed",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "An Error occurred!",
          description: error.message,
        });
      }
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
