"use client";

import { create } from "zustand";
import { Language } from "@prisma/client";
import { persist } from "zustand/middleware";
import { createContext } from "react";
import debounce from "lodash.debounce";

export type EditorProps = {
  code: { [K in keyof typeof Language as Lowercase<K>]: string };
  language: Lowercase<Language>;
  isPending: boolean;
};

export type EditorState = {
  setCode: (language: Lowercase<Language>, value: string) => void;
  setLanguage: (defaultLanguage: Lowercase<Language>) => void;
  setIsPending: (isPending: boolean) => void;
} & EditorProps;

export type EditorStore = ReturnType<typeof createEditorStore>;

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

export const createEditorStore = (
  storageName: string,
  initState?: Partial<EditorProps>,
) => {
  const DEFAULT_STATE: EditorProps = {
    code: {
      javascript: "",
      java: "",
      python: "",
    },
    language: "javascript",
    isPending: false,
  };

  return create<EditorProps & EditorState>()(
    persist(
      (set, get) => ({
        ...DEFAULT_STATE,
        ...initState,
        setCode: (language, value) => {
          set({
            code: { ...get().code, [language]: value },
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
      }),
      {
        name: storageName,
        storage: debouncedLocalStorage,
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !["isPending"].includes(key),
            ),
          ),
      },
    ),
  );
};

export const EditorContext = createContext<EditorStore | null>(null);
