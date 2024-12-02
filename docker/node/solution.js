const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const { code, tests } = req.body;

  try {
    const solution = eval(`(${code})`); // Uruchomienie kodu
    const results = tests.map((test) => ({
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput: solution(...test.input),
      passed: solution(...test.input) === test.expectedOutput,
    }));
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
