"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type SolutionLinkProps = {
  challengeName: string;
  solutionId: string;
  children: ReactNode;
};

const SolutionLink = ({
  challengeName,
  solutionId,
  children,
}: SolutionLinkProps) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(`/challenge/${challengeName}/solutions/${solutionId}`);
  };

  return (
    <button
      className={
        "flex w-full flex-col justify-start gap-3 p-4 transition hover:bg-muted dark:hover:bg-zinc-700/50"
      }
      onClick={handleRoute}
    >
      {children}
    </button>
  );
};

export default SolutionLink;
