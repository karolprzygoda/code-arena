"use client";

import { create } from "zustand";

type State = {
  layout: "classic" | "reversed";
  fullScreenElement: HTMLDivElement | null;
  isFullScreen: boolean;
};

type Actions = {
  toggleLayout: () => void;
  setFullScreenElement: (fullScreenElement: HTMLDivElement) => void;
  setIsFullScreen: (isFullScreen: boolean) => void;
};

export const useDashboardStore = create<State & Actions>()((set) => ({
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
}));
