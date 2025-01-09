"use client";

import { create } from "zustand";
import { Language } from "@prisma/client";
import { persist } from "zustand/middleware";
import { createContext } from "react";
import debounce from "lodash.debounce";

export type CodeEditorProps = {
  code: { [K in keyof typeof Language as Lowercase<K>]: string };
  language: Lowercase<Language>;
  isPending: boolean;
};

export type CodeEditorState = {
  setCode: (language: Lowercase<Language>, value: string) => void;
  setLanguage: (defaultLanguage: Lowercase<Language>) => void;
  setIsPending: (isPending: boolean) => void;
  saveCode: () => void;
} & CodeEditorProps;

export type CodeEditorStore = ReturnType<typeof createEditorStore>;

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
  initState?: Partial<CodeEditorProps>,
) => {
  const DEFAULT_STATE: CodeEditorProps = {
    code: {
      javascript: "",
      java: "",
      python: "",
    },
    language: "javascript",
    isPending: false,
  };

  return create<CodeEditorProps & CodeEditorState>()(
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
        saveCode: () => {
          const { code } = get();
          const key = storageName;
          const existingData = JSON.parse(localStorage.getItem(key) || "{}");
          existingData.state = { code };
          localStorage.setItem(key, JSON.stringify(existingData));
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

export const EditorContext = createContext<CodeEditorStore | null>(null);
