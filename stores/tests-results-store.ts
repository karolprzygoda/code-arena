"use client";

import { create } from "zustand";

type State = {
  testsResults: PrismaJson.TestResultsType;
  globalError?: PrismaJson.ErrorType | null;
};

type Actions = {
  setTestsResults: (testsResults: PrismaJson.TestResultsType) => void;
  setGlobalError: (error: PrismaJson.ErrorType | null) => void;
};

export const useTestResultsStore = create<State & Actions>()((set) => ({
  testsResults: [],
  hiddenTestsResults: [],
  globalError: null,
  testsResizablePanel: null,
  setTestsResults: (testsResults) => {
    set({
      testsResults,
    });
  },
  setGlobalError: (globalError) => {
    set({
      globalError,
    });
  },
}));
