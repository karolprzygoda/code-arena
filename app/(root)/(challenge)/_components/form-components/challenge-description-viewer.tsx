"use client";

import { useShallow } from "zustand/react/shallow";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";
import useMarkdownContext from "@/hooks/use-markdown-context";

const ChallengeDescriptionViewer = () => {
  const { markdown } = useMarkdownContext(
    useShallow((state) => ({
      markdown: state.markdown,
    })),
  );

  return (
    <div className={"h-full overflow-y-auto p-4"}>
      <MarkdownRenderer markdown={markdown} />
    </div>
  );
};

export default ChallengeDescriptionViewer;
