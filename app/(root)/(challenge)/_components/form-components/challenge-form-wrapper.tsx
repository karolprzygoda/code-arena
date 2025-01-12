"use client";

import { useChallengeFormStore } from "@/stores/challenge-form-store";
import { useShallow } from "zustand/react/shallow";
import MarkdownBuilder from "@/app/(root)/(challenge)/_components/form-components/markdown-builder";
import ChallengeForm from "@/app/(root)/(challenge)/_components/form-components/challenge-form";
import { TChallengeSchema } from "@/schemas/schema";

type ChallengeFormWrapperProps = {
  initialData?: TChallengeSchema;
  challengeId?: string;
};

const ChallengeFormWrapper = ({
  initialData,
  challengeId,
}: ChallengeFormWrapperProps) => {
  const { isEditingDescription } = useChallengeFormStore(
    useShallow((state) => ({
      isEditingDescription: state.isEditingDescription,
    })),
  );

  return isEditingDescription ? (
    <MarkdownBuilder className={"lg:w-1/2"} />
  ) : (
    <ChallengeForm initialData={initialData} challengeId={challengeId} />
  );
};

export default ChallengeFormWrapper;
