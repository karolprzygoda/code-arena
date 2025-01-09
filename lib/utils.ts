import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SubmissionResponse } from "@/lib/types";
import { getKafkaInstance, getKafkaProducer } from "@/lib/kafka/client";
import { ZodError } from "zod";
import { Language } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sendKafkaMessage = async (topic: string, message: unknown) => {
  const producer = await getKafkaProducer();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const pollSubmissionResult = async (
  submissionId: string,
  language: Language,
  timeoutMs = 30000,
): Promise<SubmissionResponse> => {
  const kafka = await getKafkaInstance();
  const consumer = kafka.consumer({
    groupId: `result-watcher-${submissionId}`,
  });

  await consumer.connect();

  const languageTopicMap: Record<string, string> = {
    javascript: "nodejs-solution-topic",
    python: "python-solution-topic",
  };

  const topic = languageTopicMap[language.toLowerCase()];

  if (!topic) {
    throw new Error(`Unsupported language: ${language}`);
  }

  await consumer.subscribe({
    topic: topic,
    fromBeginning: true,
  });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(async () => {
      reject(new Error("Timeout waiting for submission result"));
      await consumer.disconnect();
    }, timeoutMs);

    consumer
      .run({
        eachMessage: async ({ message }) => {
          const payload = JSON.parse(message.value!.toString());
          if (payload.submissionId === submissionId) {
            clearTimeout(timer);
            console.log("Result received for submission:", submissionId);
            resolve(payload.result);
            await consumer.disconnect();
          }
        },
      })
      .catch(async (err) => {
        clearTimeout(timer);
        reject(err);
        await consumer.disconnect();
      });
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

export const getMaxExecutionTime = (testResults: PrismaJson.TestResultsType) =>
  testResults.every((test) => test.passed)
    ? `${Math.max(...testResults.map((t) => t.executionTime))} ms`
    : "N/A";

export const getMaxMemoryUsage = (testResults: PrismaJson.TestResultsType) =>
  testResults.every((test) => test.passed)
    ? `${Math.max(...testResults.map((t) => t.memoryUsage))} MB`
    : "N/A";

export interface Range {
  start: number;
  end: number;
  percentage: number;
}

export interface ProcessedMetric {
  range: string;
  solutions: number;
  isActive: boolean;
}

export interface MetricData {
  data: ProcessedMetric[];
  current: number;
  beat: number;
  unit: string;
}

export function calculateRanges(values: number[]): Range[] {
  if (values.length === 0) return [];

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const rangeSize = Number((maxValue - minValue).toFixed(2)) / 50;

  const ranges: Range[] = [];
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
