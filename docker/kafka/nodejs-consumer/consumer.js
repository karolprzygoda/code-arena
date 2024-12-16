import { Kafka } from "kafkajs";
import vm from "vm";

const broker = process.env.KAFKA_BROKER || "kafka:9092";
const inputTopic = process.env.INPUT_TOPIC || "nodejs-submission-topic";

const kafka = new Kafka({
  clientId: "nodejs-solution-nodejs-consumer",
  brokers: [broker],
});

const consumer = kafka.consumer({
  groupId: "nodejs-solution-group",
});

const producer = kafka.producer();

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const executeCode = async (code, tests) => {
  try {
    const results = await Promise.all(
      tests.map(async (test) => {
        const sandbox = {
          console: {
            log: (...args) => {
              sandbox.logs.push(
                args
                  .map((arg) =>
                    typeof arg === "object" ? JSON.stringify(arg) : arg,
                  )
                  .join(" "),
              );
            },
          },
          logs: [],
          actualOutput: null,
          errorOccurred: null,
        };
        const context = vm.createContext(sandbox);
        const script = new vm.Script(
          `try{${code}; actualOutput = solution(${test.inputs.map((input) => JSON.stringify(input.value)).join(", ")});}catch(error){errorOccurred = error}`,
        );
        await script.runInContext(context, { timeout: 4000 });

        const { actualOutput, errorOccurred, logs } = sandbox;

        return {
          input: test.inputs,
          expectedOutput: test.expectedOutput,
          actualOutput,
          passed:
            !errorOccurred && deepEqual(actualOutput, test.expectedOutput),
          logs: logs,
          error: errorOccurred
            ? { message: errorOccurred.message, stack: errorOccurred.stack }
            : null,
        };
      }),
    );

    return {
      success: results.every((result) => result.passed),
      testResults: results,
    };
  } catch (error) {
    return {
      success: false,
      testResults: null,
      globalError: {
        message: error.message,
        stack: error.stack,
      },
    };
  }
};

const runConsumer = async () => {
  try {
    await consumer.connect();
    await producer.connect();

    console.log("Consumer connected to Kafka");
    console.log("Producer connected to Kafka");

    await consumer.subscribe({
      topic: inputTopic,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const payload = JSON.parse(message.value.toString());

          console.log("Received code execution request:", payload);

          const result = await executeCode(payload.code, payload.testCases);

          console.log("Execution Result:", JSON.stringify(result, null, 2));

          await producer.send({
            topic: "nodejs-solution-topic",
            messages: [
              {
                value: JSON.stringify({
                  submissionId: payload.submissionId,
                  result,
                }),
              },
            ],
          });

          console.log("Results sent to Kafka topic:", " nodejs-solution-topic");
        } catch (parseError) {
          console.error("Error parsing or executing message:", parseError);
        }
      },
    });
  } catch (error) {
    console.error("Consumer error:", error);
  }
};

runConsumer().catch(console.error);
