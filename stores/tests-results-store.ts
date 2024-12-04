"use client";

import { create } from "zustand";
import { ErrorResponseObject, TestResult } from "@/lib/types";

type State = {
  testsResults: TestResult[];
  globalError: ErrorResponseObject | null;
};

type Actions = {
  setTestsResults: (testsResults: TestResult[]) => void;
  setGlobalError: (error: ErrorResponseObject | null) => void;
};

export const useTestResultsStore = create<State & Actions>()((set) => ({
  testsResults: [],
  globalError: null,
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
