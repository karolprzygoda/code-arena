"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  layout: "classic" | "reversed";
  fullScreenElement: HTMLDivElement | null;
  isFullScreen: boolean;
  settings: {
    fontSize: string;
    tabSize: string;
  };
};

type Actions = {
  updateSettings: (settings: { fontSize: string; tabSize: string }) => void;
  toggleLayout: () => void;
  setFullScreenElement: (fullScreenElement: HTMLDivElement) => void;
  setIsFullScreen: (isFullScreen: boolean) => void;
};

export const usePreferencesStore = create<State & Actions>()(
  persist(
    (set) => ({
      settings: {
        fontSize: "14",
        tabSize: "2",
        bindings: "standard",
      },
      layout: "classic",
      fullScreenElement: null,
      isFullScreen: false,
      toggleLayout: () => {
        set((state) => ({
          layout: state.layout === "classic" ? "reversed" : "classic",
        }));
      },
      setFullScreenElement: (fullScreenElement) => {
        set({ fullScreenElement });
      },
      setIsFullScreen: (isFullScreen) => {
        set({ isFullScreen });
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: "user-preferences",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["fullScreenElement", "isFullScreen"].includes(key),
          ),
        ),
    },
  ),
);
