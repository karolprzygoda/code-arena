import { Kafka } from "kafkajs";

const broker = process.env.KAFKA_BROKER || "kafka:9092";
const inputTopic = process.env.INPUT_TOPIC || "nodejs-submission-topic";

const kafka = new Kafka({
  clientId: "nodejs-solution-consumer",
  brokers: [broker],
});

const consumer = kafka.consumer({
  groupId: "nodejs-solution-group",
});

const producer = kafka.producer();

const executeCode = async (code, tests) => {
  const originalConsoleLog = console.log;

  try {
    const moduleWrapper = new Function(`${code}; return solution;`);

    const solution = moduleWrapper();

    const results = await Promise.all(
      tests.map(async (test) => {
        const logs = [];

        console.log = (...args) => {
          logs.push(
            args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
              )
              .join(" "),
          );
          originalConsoleLog(...args);
        };

        let actualOutput;
        let errorOccurred = null;

        try {
          actualOutput = await solution(...test.inputs.map((i) => i.value));
        } catch (error) {
          errorOccurred = error;
        }

        console.log = originalConsoleLog;

        return {
          input: test.inputs,
          expectedOutput: test.expectedOutput,
          actualOutput,
          passed: !errorOccurred && actualOutput === test.expectedOutput,
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
            topic: `nodejs-solution-topic`,
            messages: [
              {
                value: JSON.stringify({
                  submissionId: payload.submissionId,
                  result,
                }),
              },
            ],
          });

          console.log("Results sent to Kafka topic:", `nodejs-solution-topic`);
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
