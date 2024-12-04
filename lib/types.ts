import { ReactNode } from "react";

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
  logs?: string[];
};

export type ErrorResponseObject = {
  message: string;
  stack: string;
};

type ErrorResponse = {
  success: false;
  results?: never;
  error: ErrorResponseObject;
  logs?: never;
};

type SuccessResponse = {
  success: true;
  results: TestResult[];
  error?: never;
  logs: string[];
};

export type DockerResponse = ErrorResponse | SuccessResponse;
