import { useContext } from "react";
import { MarkdownContext } from "@/stores/markdown-editor-store";

export function useMarkdownTemporalStore() {
  const store = useContext(MarkdownContext);
  if (!store) {
    throw new Error("useTemporalStore must be used within StoreProvider");
  }

  return {
    temporal: store.temporal,
  };
}
