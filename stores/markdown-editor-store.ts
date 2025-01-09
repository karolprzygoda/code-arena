"use client";

import { create, useStore } from "zustand";
import { temporal, TemporalState } from "zundo";

type State = {
  markdown: string;
};

type Actions = {
  setMarkdown: (markdown: string) => void;
};

export const useMarkdownEditorStore = create<State & Actions>()(
  temporal((set) => ({
    markdown: "",
    setMarkdown: (markdown) => {
      set({ markdown });
    },
  })),
);

export const useMarkdownTemporalStore = <T>(
  selector: (state: TemporalState<Pick<State, "markdown">>) => T,
) => useStore(useMarkdownEditorStore.temporal, selector);
