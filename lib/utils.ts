import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { User } from "@supabase/supabase-js";
import { MetricData, MetricRange, TypographyVariant } from "@/lib/types";
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

export const getStatusClass = (status: string) =>
  status === "SUCCESS"
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

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

export function calculateRanges(values: number[]): MetricRange[] {
  if (values.length === 0) return [];

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const rangeSize = Number((maxValue - minValue).toFixed(2)) / 50;

  const ranges: MetricRange[] = [];
  let start = minValue;

  do {
    const end = Number((start + rangeSize).toFixed(2));
    const count = values.filter(
      (value) =>
        Number(value.toFixed(2)) >= Number(start.toFixed(2)) &&
        Number(value.toFixed(2)) < Number(end.toFixed(2)),
    ).length;

    const percentage = (count / values.length) * 100;
    ranges.push({ start, end, percentage });
    start = end;
  } while (start <= maxValue);

  return ranges;
}

export function calculateBeatPercentage(
  currentValue: number,
  values: number[],
): number {
  const totalValues = values.length;
  const beatenValues = values.filter((value) => currentValue < value).length;
  return Number(((beatenValues / totalValues) * 100).toFixed(2));
}

export function processMetricData(
  values: number[],
  currentValue: number,
  type: "memoryUsage" | "executionTime",
): MetricData {
  const timeRanges = calculateRanges(values);

  const data = timeRanges.map((range) => ({
    range: `${range.start.toFixed(2) + (type === "executionTime" ? " ms" : " MB")}`,
    solutions: Number(range.percentage.toFixed(2)),
    isActive: currentValue >= range.start && currentValue < range.end, // Nowe pole
  }));

  return {
    data,
    current: currentValue,
    beat: calculateBeatPercentage(currentValue, values),
    unit: type === "executionTime" ? " ms" : " MB",
  };
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

export const processTestCases = (testCases: PrismaJson.TestCasesType) => {
  return testCases.map((testCase) => ({
    ...testCase,
    inputs: testCase.inputs.map((input) => ({
      ...input,
      value: JSON.parse(input.value as string),
    })),
    expectedOutput: JSON.parse(testCase.expectedOutput as string),
  }));
};

export const typographyMap: Record<
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
    length: 2,
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
};

type SelectionRange = { selectionStart: number; selectionEnd: number } | null;

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

export const setSelectionFromStartEnd = (
  editorRef: RefObject<editor.IStandaloneCodeEditor>,
  start: number,
  end: number,
): void => {
  if (!editorRef.current) {
    console.warn("Editor is not initialized.");
    return;
  }

  const editor = editorRef.current;
  const model = editor.getModel();

  if (!model) {
    console.warn("Model is not available.");
    return;
  }

  const startPosition = model.getPositionAt(start);
  const endPosition = model.getPositionAt(end);

  editor.setSelection({
    startLineNumber: startPosition.lineNumber,
    startColumn: startPosition.column,
    endLineNumber: endPosition.lineNumber,
    endColumn: endPosition.column,
  });

  editor.focus();
};
