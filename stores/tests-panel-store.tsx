"use client";

import { create } from "zustand";
import { ImperativePanelHandle } from "react-resizable-panels";
import { persist } from "zustand/middleware";

type State = {
  isCollapsed: boolean;
  testsResizablePanel: ImperativePanelHandle | null;
};

type Actions = {
  setIsCollapsed: (isCollapsed: boolean) => void;
  setTestsResizablePanel: (testsResizablePanel: ImperativePanelHandle) => void;
};

export const useTestsPanelStore = create<State & Actions>()(
  persist(
    (set) => ({
      isCollapsed: false,
      testsResizablePanel: null,
      setIsCollapsed: (isCollapsed) => {
        set({
          isCollapsed,
        });
      },
      setTestsResizablePanel: (testsResizablePanel) => {
        set({
          testsResizablePanel,
        });
      },
    }),
    {
      name: "tests-panel-store",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["testsResizablePanel"].includes(key),
          ),
        ),
    },
  ),
);
