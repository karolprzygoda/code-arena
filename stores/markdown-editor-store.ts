"use client";

import { create, useStore } from "zustand";
import { temporal, TemporalState } from "zundo";
import debounce from "lodash.debounce";
import { persist } from "zustand/middleware";

type State = {
  markdown: string;
  _hasHydrated: boolean;
};

type Actions = {
  setMarkdown: (markdown: string) => void;
  setHasHydrated: (_hasHydrated: boolean) => void;
  saveMarkdown: () => void;
};

const debouncedLocalStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: debounce((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, 3000),
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const useMarkdownEditorStore = create<State & Actions>()(
  persist(
    temporal(
      (set, get) => ({
        markdown: "",
        _hasHydrated: false,
        setMarkdown: (markdown) => {
          set({ markdown });
        },
        setHasHydrated: (_hasHydrated) => {
          set({
            _hasHydrated,
          });
        },
        saveMarkdown: () => {
          const { markdown } = get();
          const key = "markdown-editor-store";
          const existingData = JSON.parse(localStorage.getItem(key) || "{}");
          existingData.state = { markdown };
          localStorage.setItem(key, JSON.stringify(existingData));
        },
      }),
      {
        partialize: (state) => {
          const { markdown } = state;
          return { markdown };
        },
      },
    ),
    {
      name: "markdown-editor-store",
      storage: debouncedLocalStorage,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);

export const useMarkdownTemporalStore = <T>(
  selector: (state: TemporalState<Pick<State, "markdown">>) => T,
) => useStore(useMarkdownEditorStore.temporal, selector);
