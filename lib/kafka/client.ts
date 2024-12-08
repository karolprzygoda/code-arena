"use server";

import { Kafka, Producer } from "kafkajs";

let kafkaInstance: Kafka | null = null;
let producerInstance: Producer | null = null;

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
    const kafka = await getKafkaInstance();
    producerInstance = kafka.producer();
    await producerInstance.connect();
    console.log("Kafka producer connected");
  }
  return producerInstance;
};

const disconnectKafkaProducer = async (): Promise<void> => {
  if (producerInstance) {
    await producerInstance.disconnect();
    console.log("Kafka producer disconnected");
    producerInstance = null;
  }
};

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await disconnectKafkaProducer();
  process.exit();
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await disconnectKafkaProducer();
  process.exit();
});
