"use client";

import { create } from "zustand";
import { Language } from "@prisma/client";

type State = {
  code: string;
  language: Lowercase<Language>;
  isPending: boolean;
};

type Actions = {
  setCode: (value: string) => void;
  setLanguage: (defaultLanguage: Lowercase<Language>) => void;
  setIsPending: (isPending: boolean) => void;
};

export const useEditorStore = create<State & Actions>()((set) => ({
  code: "",
  language: "javascript",
  isPending: false,
  setCode: (value) => {
    set({
      code: value,
    });
  },
  setLanguage: (language) => {
    set({
      language,
    });
  },
  setIsPending: (isPending) => {
    set({
      isPending,
    });
  },
}));
