"use client";

import { create } from "zustand";

type State = {
  isEditingDescription: boolean;
};

type Actions = {
  setIsEditingDescription: (setIsEditingDescription: boolean) => void;
};

export const useChallengeFormStore = create<State & Actions>()((set) => ({
  isEditingDescription: false,
  setIsEditingDescription: (isEditingDescription) => {
    set({
      isEditingDescription,
    });
  },
}));
