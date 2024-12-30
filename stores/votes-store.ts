"use client";

import { create } from "zustand";
import { createContext } from "react";

export type VotesProps = {
  vote: "LIKE" | "DISLIKE" | null;
  likes: number;
  dislikes: number;
};

export type VotesState = {
  setVote: (vote: "LIKE" | "DISLIKE" | null) => void;
  incrementLikes: () => void;
  decrementLikes: () => void;
  incrementDislikes: () => void;
  decrementDislikes: () => void;
} & VotesProps;

export type VotesStore = ReturnType<typeof createVotesStore>;

export const createVotesStore = (initState?: Partial<VotesProps>) => {
  const DEFAULT_STATE: VotesProps = {
    vote: null,
    likes: 0,
    dislikes: 0,
  };

  return create<VotesProps & VotesState>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    setVote: (vote) =>
      set((state) => {
        if (vote === state.vote) {
          if (vote === "LIKE") {
            return { vote: null, likes: state.likes - 1 };
          }
          if (vote === "DISLIKE") {
            return { vote: null, dislikes: state.dislikes - 1 };
          }
        }

        if (vote === "LIKE") {
          return {
            vote,
            likes: state.likes + 1,
            dislikes:
              state.vote === "DISLIKE" ? state.dislikes - 1 : state.dislikes,
          };
        }

        if (vote === "DISLIKE") {
          return {
            vote,
            dislikes: state.dislikes + 1,
            likes: state.vote === "LIKE" ? state.likes - 1 : state.likes,
          };
        }

        return { vote };
      }),

    incrementLikes: () =>
      set((state) => ({
        likes: state.likes + 1,
      })),
    decrementLikes: () =>
      set((state) => ({
        likes: state.likes > 0 ? state.likes - 1 : 0,
      })),
    incrementDislikes: () =>
      set((state) => ({
        dislikes: state.dislikes + 1,
      })),
    decrementDislikes: () =>
      set((state) => ({
        dislikes: state.dislikes > 0 ? state.dislikes - 1 : 0,
      })),
  }));
};

export const VotesContext = createContext<VotesStore | null>(null);
