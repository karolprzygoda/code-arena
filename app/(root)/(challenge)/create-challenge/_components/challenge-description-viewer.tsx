"use client";

import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";

import { useShallow } from "zustand/react/shallow";
import MarkdownRenderer from "@/app/(root)/(challenge)/_components/markdown-renderer";

const ChallengeDescriptionViewer = () => {
  const { markdown } = useMarkdownEditorStore(
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
