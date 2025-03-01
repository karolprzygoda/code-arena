"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import { TYPOGRAPHY_MAP } from "@/lib/utils";
import { TypographyVariant } from "@/lib/types";
import { createContext } from "react";

export type MarkdownProps = {
  markdown: string;
};

export type MarkdownState = {
  setMarkdown: (markdown: string) => void;
  updateMarkdown: (
    typographyVariant: TypographyVariant,
    selectionStart: number,
    selectionEnd: number,
  ) => void;
  addToMarkdown: (
    selectionStart: number,
    selectionEnd: number,
    text: string,
  ) => void;
  getMarkdown: () => string;
} & MarkdownProps;

export type MarkdownStore = ReturnType<typeof createMarkdownStore>;

export const createMarkdownStore = (initState?: Partial<MarkdownProps>) => {
  const DEFAULT_STATE: MarkdownProps = {
    markdown: "",
  };

  return create<MarkdownProps & MarkdownState>()(
    temporal((set, get) => ({
      ...DEFAULT_STATE,
      ...initState,
      setMarkdown: (markdown) => {
        set({ markdown });
      },
      updateMarkdown: (typographyVariant, selectionStart, selectionEnd) => {
        set((state) => ({
          markdown:
            state.markdown.slice(0, selectionStart) +
            TYPOGRAPHY_MAP[typographyVariant].format(
              state.markdown.slice(selectionStart, selectionEnd),
            ) +
            state.markdown.slice(selectionEnd),
        }));
      },
      addToMarkdown: (selectionStart, selectionEnd, text) => {
        set((state) => ({
          markdown:
            state.markdown.slice(0, selectionStart) +
            text +
            state.markdown.slice(selectionEnd),
        }));
      },
      getMarkdown: () => get().markdown,
    })),
  );
};

export const MarkdownContext = createContext<MarkdownStore | null>(null);
