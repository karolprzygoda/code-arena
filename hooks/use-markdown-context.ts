import { useContext } from "react";
import { useStore } from "zustand/index";
import { MarkdownContext, MarkdownState } from "@/stores/markdown-editor-store";

const useMarkdownContext = <T>(selector: (action: MarkdownState) => T): T => {
  const store = useContext(MarkdownContext);
  if (!store) throw new Error("Missing EditorContext.Provider in the tree");

  return useStore(store, selector);
};

export default useMarkdownContext;
