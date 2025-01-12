"use server";

import { Kafka, Producer } from "kafkajs";
import { KafkaMessageType, SubmissionResponse } from "@/lib/types";
import { Language } from "@prisma/client";
import { solutionTopicMap } from "@/lib/utils";

let kafkaInstance: Kafka | null = null;
let producerInstance: Producer | null = null;
let isReconnecting = false;
let isShuttingDown = false;

export const getKafkaInstance = async (): Promise<Kafka> => {
  if (!kafkaInstance) {
    kafkaInstance = new Kafka({
      clientId: "code-arena",
      brokers: ["localhost:9092"],
    });
    console.log("Kafka instance initialized");
  }
  return kafkaInstance;
};

export const getKafkaProducer = async (): Promise<Producer> => {
  if (!producerInstance) {
    await connectKafkaProducer();
  }
  return producerInstance!;
};

const disconnectKafkaProducer = async (): Promise<void> => {
  if (producerInstance) {
    await producerInstance.disconnect();
    console.log("Kafka producer disconnected");
    producerInstance = null;
  }
};

const connectKafkaProducer = async (): Promise<void> => {
  try {
    const kafka = await getKafkaInstance();
    producerInstance = kafka.producer();

    producerInstance.on("producer.disconnect", async () => {
      console.error("Kafka producer disconnected. Attempting to reconnect...");
      await reconnectKafkaProducer();
    });

    await producerInstance.connect();
    console.log("Kafka producer connected");
  } catch (error) {
    console.error("Failed to connect Kafka producer:", error);
    await reconnectKafkaProducer();
  }
};

const reconnectKafkaProducer = async (): Promise<void> => {
  if (isReconnecting || isShuttingDown) return;
  isReconnecting = true;

  const maxRetries = 5;
  const retryInterval = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Reconnecting Kafka producer (attempt ${attempt}/${maxRetries})...`,
      );
      await connectKafkaProducer();
      isReconnecting = false;
      return;
    } catch (error) {
      console.error(`Reconnect attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  }

  console.error("Failed to reconnect Kafka producer after max retries");
  isReconnecting = false;
};

const safeShutdown = async (): Promise<void> => {
  isShuttingDown = true;
  try {
    console.log("Disconnecting Kafka producer...");
    await disconnectKafkaProducer();
    console.log("Kafka producer disconnected successfully.");
  } catch (error) {
    console.error("Error during Kafka producer disconnection:", error);
  } finally {
    console.log("Application is shutting down.");
    process.exit();
  }
};

export const sendKafkaMessage = async (
  topic: string,
  message: KafkaMessageType,
) => {
  const producer = await getKafkaProducer();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const pollSubmissionResult = async (
  kafkaMessageId: string,
  language: Language,
  timeoutMs = 30000,
): Promise<SubmissionResponse> => {
  const kafka = await getKafkaInstance();
  const consumer = kafka.consumer({
    groupId: `result-watcher-${kafkaMessageId}`,
  });

  await consumer.connect();

  const topic = solutionTopicMap[language.toLowerCase()];

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
          if (payload.kafkaMessageId === kafkaMessageId) {
            console.log(payload);
            clearTimeout(timer);
            console.log("Result received for submission:", kafkaMessageId);
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

process.on("SIGINT", async () => {
  console.log("Received SIGINT (Ctrl+C). Shutting down gracefully...");
  await safeShutdown();
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  await safeShutdown();
});
