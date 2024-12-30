import { useContext } from "react";
import { EditorContext, EditorState } from "@/stores/editor-store";
import { useStore } from "zustand";

const useEditorContext = <T>(selector: (action: EditorState) => T): T => {
  const store = useContext(EditorContext);
  if (!store) throw new Error("Missing EditorContext.Provider in the tree");

  return useStore(store, selector);
};

export default useEditorContext;
