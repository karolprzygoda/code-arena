import { ReactNode } from "react";
import { Submission } from "@prisma/client";

export type AvailableLanguages = "JavaScript" | "Java" | "Python";

export type Test = {
  inputs: Array<{ name: string; value: unknown & ReactNode }>;
  expectedOutput: unknown & ReactNode;
};

export type TestResult = {
  input: number;
  expectedOutput: number;
  actualOutput: number;
  passed: boolean;
  logs: string[];
};

export type ErrorResponseObject = {
  message: string;
  stack: string;
};

export type StateType = {
  title: string;
  description: string;
  variant: "default" | "destructive";
};

export type SubmissionResponse = {
  success: boolean;
  testResults: TestResult[];
};
