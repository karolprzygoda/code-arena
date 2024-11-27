"use client";

import { create } from "zustand";
import { AvailableLanguages } from "@/lib/types";

type State = {
  value: string;
  defaultValue: string;
  language: AvailableLanguages;
};

type Actions = {
  setValue: (value: string) => void;
  setDefaultValue: (defaultValue: string) => void;
  setLanguage: (defaultLanguage: AvailableLanguages) => void;
};

export const useEditorStore = create<State & Actions>()((set) => ({
  value: "",
  defaultValue: "",
  language: "JavaScript",
  setValue: (value) => {
    set({
      value,
    });
  },
  setDefaultValue: (defaultValue) => {
    set({
      defaultValue,
    });
  },
  setLanguage: (language) => {
    set({
      language,
    });
  },
}));
