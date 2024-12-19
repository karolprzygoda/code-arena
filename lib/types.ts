import { Language } from "@prisma/client";

declare global {
  namespace PrismaJson {
    type ErrorType = { message: string; stack: string };
    type InputType = { name: string; value: unknown };
    type TestCasesType = {
      inputs: InputType[];
      expectedOutput: unknown;
    }[];
    type DefaultCodeType = Record<Lowercase<Language>, string>;
    type TestResultsType = {
      input: unknown;
      expectedOutput: unknown;
      actualOutput: unknown;
      passed: boolean;
      logs: string[];
      error?: ErrorType | null;
    }[];
  }
}

export type TypographyVariant =
  | "bold"
  | "italic"
  | "strike"
  | "inlineCode"
  | "quote"
  | "unorderedList"
  | "orderedList"
  | "h1"
  | "h2"
  | "h3";

type SuccessSubmissionResponse = {
  success: true;
  testResults: PrismaJson.TestResultsType;
  globalError: never;
};

type ErrorSubmissionResponse = {
  success: false;
  testResults: never;
  globalError: PrismaJson.ErrorType;
};

export type SubmissionResponse =
  | SuccessSubmissionResponse
  | ErrorSubmissionResponse;
