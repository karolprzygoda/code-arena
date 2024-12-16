import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SubmissionResponse } from "@/lib/types";
import { getKafkaInstance, getKafkaProducer } from "@/lib/kafka/client";
import { ZodError } from "zod";
import { Language } from "@prisma/client";

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
