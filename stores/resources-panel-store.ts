"use client";

import { create } from "zustand";
import { ImperativePanelHandle } from "react-resizable-panels";

type State = {
  isCollapsed: boolean;
  resourcesResizablePanel: ImperativePanelHandle | null;
};

type Actions = {
  setIsCollapsed: (isCollapsed: boolean) => void;
  setResourcesResizablePanel: (
    testsResizablePanel: ImperativePanelHandle,
  ) => void;
};

export const useResourcesPanelStore = create<State & Actions>()((set) => ({
  isCollapsed: false,
  resourcesResizablePanel: null,
  setIsCollapsed: (isCollapsed) => {
    set({
      isCollapsed,
    });
  },
  setResourcesResizablePanel: (resourcesResizablePanel) => {
    set({
      resourcesResizablePanel,
    });
  },
}));
