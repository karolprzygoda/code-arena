import MarkdownRenderer from "@/app/(root)/create-challange/_components/markdown-renderer";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { useShallow } from "zustand/react/shallow";

const MarkdownWrapper = () => {
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

export default MarkdownWrapper;
