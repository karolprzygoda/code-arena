"use server";

// Moze uzyc pakietu dockerode

import * as fs from "fs/promises";
import { exec } from "node:child_process";

export const testChallenge = async (code: string) => {
  const tests = [
    { input: [1, 2], expectedOutput: 3 },
    { input: [1, 4], expectedOutput: 5 },
    { input: [1, 6], expectedOutput: 7 },
  ];
  try {
    const finalCode = `
      const solution = ${code};
      const tests = ${JSON.stringify(tests)};
      const results = tests.map(test => ({
        passed: test.expectedOutput === solution(...test.input),
        input: test.input,
        expectedOutput: test.expectedOutput
      }));
      console.log(JSON.stringify(results));
    `;

    await fs.writeFile("/test/code-execution/test.js", finalCode, "utf-8");

    return await new Promise((resolve, reject) => {
      exec(
        `docker run --rm -v /c/test/code-execution:/app -w /app node node test.js`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            reject(stderr || error?.message);
          } else {
            resolve(JSON.parse(stdout));
          }
        },
      );
    });
  } catch (error) {
    console.error("Błąd:", error);
    return { error: "Błąd podczas uruchamiania kodu." };
  }
};

export const testChallenge2 = async (code: string) => {
  const tests = [
    { input: [1, 2], expectedOutput: 3 },
    { input: [1, 4], expectedOutput: 5 },
    { input: [1, 6], expectedOutput: 7 },
  ];
  try {
    return await new Promise((resolve, reject) => {
      const sanitizedCode = code.replace(/  |\r\n|\n|\r/gm, "");

      const sanitizedTests = JSON.stringify(tests).replace(/"/g, '\\"');

      const command = `docker run --rm -e USER_FUNCTION="${sanitizedCode}" -e USER_TESTS="${sanitizedTests}" runners:latest node runner.js`;

      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(stderr || error?.message);
        } else {
          resolve(JSON.parse(stdout));
        }
      });
    });
  } catch (error) {
    console.error("Błąd:", error);
    return { error: "Błąd podczas uruchamiania kodu." };
  }
};
