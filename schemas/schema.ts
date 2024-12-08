import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email hast to be valid."),
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

export type TAuthSchema = z.infer<typeof authSchema>;
