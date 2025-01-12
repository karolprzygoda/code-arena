"use client";

import { Button } from "@/components/ui/button";
import { handleNewSubmission } from "@/actions/challenge-actions";
import { useShallow } from "zustand/react/shallow";
import { useTestResultsStore } from "@/stores/tests-results-store";
import { Language } from "@prisma/client";
import { useState } from "react";
import { userCodeSchema } from "@/schemas/schema";
import { getCodeSubmissionError } from "@/lib/utils";
import useEditorContext from "@/hooks/use-editor-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const [userCodeCache, setUserCodeCache] = useState(defaultCode[language]);

  const handleSubmit = async (code: string, language: Lowercase<Language>) => {
    try {
      userCodeSchema.parse({ code, language, challengeId });

      if (userCodeCache === code) {
        throw new Error("Your code has no changes.");
      }

      setIsPending(true);
      setGlobalError(null);

      const response = await handleNewSubmission(
        code,
        language.toUpperCase() as Language,
        challengeId,
      );

      if (response.globalError || !response.testResults) {
        setGlobalError(response.globalError);
      } else {
        setTestsResults(response.testResults);
      }

      if (response.status === "FAIL") {
        toast.error("Uh oh! You still have errors.");
      } else {
        toast.success("All tests were passed successfully");
      }

      router.push(
        `/challenge/${response.challenge.title}/submissions/${response.id}`,
      );
    } catch (error) {
      toast.error(getCodeSubmissionError(error));
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
