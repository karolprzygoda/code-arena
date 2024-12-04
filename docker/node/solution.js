const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const { code, tests } = req.body;

  const originalConsoleLog = console.log;

  try {
    const solution = eval(`(${code})`); // Uruchomienie kodu

    const results = tests.map((test) => {
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
      const actualOutput = solution(...test.inputs.map((i) => i.value));
      console.log = originalConsoleLog;
      return {
        input: test.input,
        expectedOutput: test.expectedOutput,
        actualOutput,
        passed: actualOutput === test.expectedOutput,
        logs: logs,
      };
    });

    res.json({ success: true, results });
  } catch (error) {
    res.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
