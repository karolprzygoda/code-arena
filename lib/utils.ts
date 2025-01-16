import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { User } from "@supabase/supabase-js";
import { SelectionRange, TypographyVariant } from "@/lib/types";
import { RefObject } from "react";
import { editor } from "monaco-editor";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const solutionTopicMap: Record<string, string> = {
  javascript: "nodejs-solution-topic",
  python: "python-solution-topic",
};

export const submissionTopicMap: Record<string, string> = {
  javascript: "nodejs-submission-topic",
  python: "python-submission-topic",
};

export const sanitizeTestCases = (testCases: PrismaJson.TestCasesType) => {
  return testCases
    .map((testCase) =>
      testCase.hidden
        ? {
            inputs: null as unknown as PrismaJson.InputType[],
            expectedOutput: null,
            hidden: testCase.hidden,
          }
        : testCase,
    )
    .sort((a, b) => {
      if (a.hidden === b.hidden) return 0;
      return a.hidden ? 1 : -1;
    });
};

export const sanitizeTestResults = (
  testResults: PrismaJson.TestResultsType,
) => {
  return testResults
    .map((testResult) =>
      testResult.hidden
        ? {
            input: null,
            expectedOutput: null,
            actualOutput: null,
            passed: testResult.passed,
            logs: [],
            error: null,
            hidden: testResult.hidden,
            memoryUsage: testResult.memoryUsage,
            executionTime: testResult.executionTime,
          }
        : testResult,
    )
    .sort((a, b) => {
      if (a.hidden === b.hidden) return 0;
      return a.hidden ? 1 : -1;
    });
};

export function getCodeSubmissionError(error: unknown) {
  if (error instanceof ZodError) {
    return error.errors?.[0]?.message || "Validation error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export const getUserProfilePicture = (user: User | null) => {
  if (!user) {
    return null;
  }

  if (user.user_metadata.avatar_url) {
    return user.user_metadata.avatar_url;
  } else {
    return null;
  }
};

export const STATUS_STYLE = {
  SUCCESS: "text-emerald-600 dark:text-emerald-400",
  FAIL: "text-rose-600 dark:text-rose-400",
};

export const getMaxExecutionTime = (
  testResults: PrismaJson.TestResultsType | null,
) =>
  testResults?.every((test) => test.passed)
    ? `${Math.max(...testResults.map((t) => t.executionTime))} ms`
    : "N/A";

export const getMaxMemoryUsage = (
  testResults: PrismaJson.TestResultsType | null,
) =>
  testResults?.every((test) => test.passed)
    ? `${Math.max(...testResults.map((t) => t.memoryUsage))} MB`
    : "N/A";

export const parseTestCases = (testCases: PrismaJson.TestCasesType) => {
  return testCases.map((testCase) => ({
    ...testCase,
    inputs: testCase.inputs.map((input) => ({
      ...input,
      value: JSON.parse(input.value as string),
    })),
    expectedOutput: JSON.parse(testCase.expectedOutput as string),
  }));
};

export const stringifyTestCases = (testCases: PrismaJson.TestCasesType) => {
  return testCases.map((testCase) => ({
    ...testCase,
    expectedOutput: JSON.stringify(testCase.expectedOutput),
    inputs: testCase.inputs.map((input) => ({
      ...input,
      value: JSON.stringify(input.value),
    })),
  }));
};

export const TYPOGRAPHY_MAP: Record<
  TypographyVariant,
  { format: (text: string) => string; length: number }
> = {
  bold: {
    format: (text) => `**${text}**`,
    length: 4,
  },
  italic: {
    format: (text) => `*${text}*`,
    length: 2,
  },
  strike: {
    format: (text) => `~~${text}~~`,
    length: 4,
  },
  inlineCode: {
    format: (text) => `\`${text}\``,
    length: 2,
  },
  quote: {
    format: (text) => `> ${text}`,
    length: 2,
  },
  unorderedList: {
    format: (text) => `- ${text}`,
    length: 2,
  },
  orderedList: {
    format: (text) => `1. ${text}`,
    length: 3,
  },
  h1: {
    format: (text) => `# ${text}`,
    length: 2,
  },
  h2: {
    format: (text) => `## ${text}`,
    length: 3,
  },
  h3: {
    format: (text) => `### ${text}`,
    length: 4,
  },
} as const;

export const getSelectionStartEnd = (
  editorRef: RefObject<editor.IStandaloneCodeEditor>,
): SelectionRange => {
  if (!editorRef.current) {
    console.warn("Editor is not initialized.");
    return null;
  }

  const editor = editorRef.current;
  const model = editor.getModel();
  const selection = editor.getSelection();

  if (!model || !selection) {
    console.warn("Model or selection is not available.");
    return null;
  }

  const selectionStart = model.getOffsetAt({
    lineNumber: selection.startLineNumber,
    column: selection.startColumn,
  });

  const selectionEnd = model.getOffsetAt({
    lineNumber: selection.endLineNumber,
    column: selection.endColumn,
  });

  return { selectionStart, selectionEnd };
};

export const createUserName = (email: string) => {
  return `@${email.split("@").at(0)}`;
};

export const fromKebabCaseToPascalCase = (text: string) => {
  return text
    .split("-")
    .map((t) => t.slice(0, 1).toUpperCase() + t.slice(1))
    .join(" ");
};

export const formPascalCaseToKebabCase = (text: string) => {
  return text.split(" ").join("-").toLowerCase();
};
