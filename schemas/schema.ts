import { z } from "zod";

const MAX_SIZE_KB = 500000;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

export const authSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email has to be valid."),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(32, { message: "Password can be up to 32 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one digit." })
    .regex(/[^a-zA-Z0-9]/, {
      message:
        "Password must contain at least one special character (e.g., !@#$%^&*).",
    }),
});

export const userCodeSchema = z.object({
  code: z
    .string({ required_error: "code is required" })
    .min(1, "Code cannot be empty")
    .refine((val) => val.includes("solution"), {
      message: "Code must include function named 'solution'",
    })
    .refine((code) => new TextEncoder().encode(code).length <= MAX_SIZE_BYTES, {
      message: `Code must not exceed ${MAX_SIZE_KB} KB`,
    }),
  language: z.enum(["javascript", "python", "java"], {
    errorMap: () => ({ message: "Invalid language selected" }),
  }),
  challengeId: z
    .string({ required_error: "Challenge ID is required" })
    .uuid({ message: "Challenge ID must be a positive integer" }),
});

const inputSchema = z
  .object({
    name: z.string().min(1, "Input name is required"),
    value: z.string().min(1, "Input value is required"),
  })
  .array();

export const testCasesSchema = z
  .object({
    inputs: inputSchema,
    expectedOutput: z.string().min(1, "Expected output is required"),
    hidden: z.boolean(),
  })
  .array();

export const challengeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  title: z
    .string()
    .min(1, "Challenge title is required")
    .max(50, "Challenge title cannot exceed 50 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    errorMap: () => ({
      message: "Please select a valid difficulty level (EASY, MEDIUM, HARD)",
    }),
  }),
  descriptionSnippet: z
    .string()
    .min(1, "Challenge quick description is required")
    .max(200, "Challenge description cannot exceed 200 characters"),
  testCases: testCasesSchema
    .min(5, "At least five test cases are required")
    .refine(
      (testCases) => testCases.filter((test) => test.hidden).length >= 2,
      {
        message: "At least two hidden test cases are required",
      },
    ),
});

export type TTestCasesSchema = z.infer<typeof testCasesSchema>;
export type TChallengeSchema = z.infer<typeof challengeSchema>;
export type TAuthSchema = z.infer<typeof authSchema>;
