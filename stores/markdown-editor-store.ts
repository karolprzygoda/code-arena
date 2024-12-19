"use client";

import { create } from "zustand";
import { useEffect } from "react";

type HistoryState = {
  markdown: string;
  cursorPosition: number | null;
};

type State = {
  markdown: string;
  textAreaElement: HTMLTextAreaElement | null;
  history: HistoryState[];
  currentPosition: number;
};

type Actions = {
  setMarkdown: (markdown: string) => void;
  setTextAreaElement: (textAreaElement: HTMLTextAreaElement) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export const useMarkdownEditorStore = create<State & Actions>()((set, get) => ({
  markdown: "",
  textAreaElement: null,
  history: [{ markdown: "", cursorPosition: null }],
  currentPosition: 0,

  setMarkdown: (markdown) => {
    const state = get();
    const textAreaElement = state.textAreaElement;
    const cursorPosition = textAreaElement?.selectionStart ?? null;

    const newHistory = state.history.slice(0, state.currentPosition + 1);

    set({
      markdown,
      history: [...newHistory, { markdown, cursorPosition }],
      currentPosition: state.currentPosition + 1,
    });
  },

  setTextAreaElement: (textAreaElement) => {
    set({ textAreaElement });
  },

  undo: () => {
    const state = get();
    if (state.currentPosition > 0) {
      const newPosition = state.currentPosition - 1;
      const previousState = state.history[newPosition];

      set({
        markdown: previousState.markdown,
        currentPosition: newPosition,
      });

      if (previousState.cursorPosition !== null && state.textAreaElement) {
        setTimeout(() => {
          state.textAreaElement?.setSelectionRange(
            previousState.cursorPosition!,
            previousState.cursorPosition!,
          );
          state.textAreaElement?.focus();
        }, 0);
      }
    }
  },

  redo: () => {
    const state = get();
    if (state.currentPosition < state.history.length - 1) {
      const newPosition = state.currentPosition + 1;
      const nextState = state.history[newPosition];

      set({
        markdown: nextState.markdown,
        currentPosition: newPosition,
      });

      if (nextState.cursorPosition !== null && state.textAreaElement) {
        setTimeout(() => {
          state.textAreaElement?.setSelectionRange(
            nextState.cursorPosition!,
            nextState.cursorPosition!,
          );
          state.textAreaElement?.focus();
        }, 0);
      }
    }
  },

  canUndo: () => {
    const state = get();
    return state.currentPosition > 0;
  },

  canRedo: () => {
    const state = get();
    return state.currentPosition < state.history.length - 1;
  },
}));

export const useMarkdownEditorKeyboardShortcuts = () => {
  const { undo, redo } = useMarkdownEditorStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        redo();
      } else if (
        event.ctrlKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [undo, redo]);
};
