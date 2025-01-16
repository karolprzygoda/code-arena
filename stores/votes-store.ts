"use client";

import { create } from "zustand";
import { createContext } from "react";

export type VotesProps = {
  vote: "UPVOTE" | "DOWNVOTE" | null;
  upVotes: number;
  downVotes: number;
  itemId: string | null;
};

export type VotesState = {
  setVote: (vote: "UPVOTE" | "DOWNVOTE" | null) => void;
  setChallengeId: (challengeId: string) => void;
} & VotesProps;

export type VotesStore = ReturnType<typeof createVotesStore>;

export const createVotesStore = (initState?: Partial<VotesProps>) => {
  const DEFAULT_STATE: VotesProps = {
    vote: null,
    upVotes: 0,
    downVotes: 0,
    itemId: null,
  };

  return create<VotesProps & VotesState>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    setVote: (vote) =>
      set((state) => {
        if (vote === state.vote) {
          if (vote === "UPVOTE") {
            return { vote: null, upVotes: state.upVotes - 1 };
          }
          if (vote === "DOWNVOTE") {
            return { vote: null, downVotes: state.downVotes - 1 };
          }
        }

        if (vote === "UPVOTE") {
          return {
            vote,
            upVotes: state.upVotes + 1,
            downVotes:
              state.vote === "DOWNVOTE" ? state.downVotes - 1 : state.downVotes,
          };
        }

        if (vote === "DOWNVOTE") {
          return {
            vote,
            downVotes: state.downVotes + 1,
            upVotes:
              state.vote === "UPVOTE" ? state.upVotes - 1 : state.upVotes,
          };
        }

        return { vote };
      }),
    setChallengeId: () => {
      set((state) => ({
        itemId: state.itemId,
      }));
    },
  }));
};

export const VotesContext = createContext<VotesStore | null>(null);
