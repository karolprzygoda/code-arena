"use client";

import { create } from "zustand";
import { AvailableLanguages } from "@/lib/types";
import { persist } from "zustand/middleware";

type State = {
  value: string;
  defaultValue: string;
  defaultLanguage: AvailableLanguages;
  settings: {
    fontSize: string;
    tabSize: string;
  };
};

type Actions = {
  setValue: (value: string) => void;
  setDefaultValue: (defaultValue: string) => void;
  setDefaultLanguage: (defaultLanguage: AvailableLanguages) => void;
  updateSettings: (settings: { fontSize: string; tabSize: string }) => void;
};

export const useEditorStore = create<State & Actions>()(
  persist(
    (set) => ({
      value: "",
      defaultValue: "",
      defaultLanguage: "JavaScript",
      settings: {
        fontSize: "14",
        tabSize: "2",
        bindings: "standard",
      },
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
      setDefaultLanguage: (defaultLanguage) => {
        set({
          defaultLanguage,
        });
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    { name: "editor-settings" },
  ),
);
