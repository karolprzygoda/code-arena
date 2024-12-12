"use client";

import { Button } from "@/components/ui/button";
import { testChallenge } from "@/actions/actions";
import { useStore } from "zustand/index";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { Language } from "@prisma/client";
import { useState } from "react";

type ChallangeSubmitButtonProps = {
  challangeId: string;
  defaultCode: PrismaJson.DefaultCodeType;
};

const ChallangeSubmitButton = ({
  challangeId,
  defaultCode,
}: ChallangeSubmitButtonProps) => {
  const { code, language, isPending, setIsPending } = useStore(
    useEditorStore,
    useShallow((state) => ({
      code: state.code,
      language: state.language,
      isPending: state.isPending,
      setIsPending: state.setIsPending,
    })),
  );

  const { setTestsResults, setGlobalError } = useStore(
    useTestResultsStore,
    useShallow((state) => ({
      setTestsResults: state.setTestsResults,
      setGlobalError: state.setGlobalError,
    })),
  );

  const [userCodeCache, setUserCodeCache] = useState(defaultCode[language]);

  const handleSubmit = async (code: string, language: Lowercase<Language>) => {
    try {
      setIsPending(true);
      setUserCodeCache(code);
      if (userCodeCache === code) {
        throw new Error("Your code has no changes.");
      }
      if (code === "") {
        throw new Error("Your code is empty.");
      }
      const response = await testChallenge(
        code,
        language.toUpperCase() as Language,
        challangeId,
      );

      setTestsResults(response.testResults);

      if (response.status === "FAIL") {
        toast({
          variant: "destructive",
          title: "Uh oh! You still have errors.",
        });

        if (response.globalError) {
          setGlobalError(response.globalError);
        }
      } else {
        toast({
          title: "All tests passed",
        });
        setGlobalError(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error occurred!",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={() => {
        void handleSubmit(code, language);
      }}
      className={"rounded-xl font-bold"}
      disabled={isPending}
    >
      {isPending ? "Submitting..." : "Submit"}
    </Button>
  );
};

export default ChallangeSubmitButton;
