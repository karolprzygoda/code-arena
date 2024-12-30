"use client";

import { Button } from "@/components/ui/button";
import { testChallenge } from "@/actions/actions";
import { useShallow } from "zustand/react/shallow";
import { toast } from "@/hooks/use-toast";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { Language } from "@prisma/client";
import { useState } from "react";
import { userCodeSchema } from "@/schemas/schema";
import { getCodeSubmissionError } from "@/lib/utils";
import useEditorContext from "@/hooks/use-editor-context";

type SubmitChallengeButtonProps = {
  challengeId: string;
  defaultCode: PrismaJson.DefaultCodeType;
};

const SubmitChallengeButton = ({
  challengeId,
  defaultCode,
}: SubmitChallengeButtonProps) => {
  const { code, language, isPending, setIsPending } = useEditorContext(
    useShallow((state) => ({
      code: state.code,
      language: state.language,
      isPending: state.isPending,
      setIsPending: state.setIsPending,
    })),
  );
  const { setTestsResults, setGlobalError } = useTestResultsStore(
    useShallow((state) => ({
      setTestsResults: state.setTestsResults,
      setGlobalError: state.setGlobalError,
    })),
  );

  const [userCodeCache, setUserCodeCache] = useState(defaultCode[language]);

  const handleSubmit = async (code: string, language: Lowercase<Language>) => {
    try {
      setIsPending(true);

      userCodeSchema.parse({ code, language, challengeId });

      if (userCodeCache === code) {
        throw new Error("Your code has no changes.");
      }

      const response = await testChallenge(
        code,
        language.toUpperCase() as Language,
        challengeId,
      );

      setTestsResults(response.testResults);

      if (response.status === "FAIL") {
        toast({
          variant: "destructive",
          title: "Uh oh! You still have errors.",
        });

        if (response.globalError) {
          setGlobalError(response.globalError);
        } else {
          setGlobalError(null);
        }
      } else {
        toast({
          title: "Success",
          description: "All tests were passed successfully",
          variant: "success",
        });
        setGlobalError(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error occurred!",
        description: getCodeSubmissionError(error),
      });
    } finally {
      setIsPending(false);
      setUserCodeCache(code);
    }
  };

  return (
    <Button
      onClick={() => handleSubmit(code[language], language)}
      className={"rounded-xl font-bold"}
      disabled={isPending}
    >
      {isPending ? "Submitting..." : "Submit"}
    </Button>
  );
};

export default SubmitChallengeButton;
