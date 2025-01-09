"use client";

import { create } from "zustand";
import { Language, Status, Submission } from "@prisma/client";
import { createContext } from "react";

export type SubmissionsProps = {
  initialSubmissions: Submission[];
  submissions: Submission[];
  language: Language | "LANGUAGE";
  status: Status | "STATUS";
};

export type SubmissionsState = {
  setSubmissions: (submission: Submission[]) => void;
  setLanguage: (language: Language | "LANGUAGE") => void;
  setStatus: (status: Status | "STATUS") => void;
} & SubmissionsProps;

export type SubmissionsStore = ReturnType<typeof createSubmissionsStore>;

export const createSubmissionsStore = (
  initState?: Partial<SubmissionsProps>,
) => {
  const DEFAULT_STATE: SubmissionsProps = {
    initialSubmissions: [],
    submissions: [],
    language: "LANGUAGE",
    status: "STATUS",
  };

  return create<SubmissionsProps & SubmissionsState>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    setSubmissions: (submissions) => {
      set({
        submissions,
      });
    },
    setLanguage: (language) => {
      set({
        language,
      });
    },
    setStatus: (status) => {
      set({
        status,
      });
    },
  }));
};

export const SubmissionsContext = createContext<SubmissionsStore | null>(null);
