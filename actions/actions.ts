"use server";

import {
  authSchema,
  createChallengeSchema,
  TAuthSchema,
  TChallengeSchema,
  userCodeSchema,
} from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Language, Submission } from "@prisma/client";
import { pollSubmissionResult, sendKafkaMessage } from "@/lib/utils";
import { AuthError } from "@supabase/auth-js";

export async function signIn(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const validatedAuthData = authSchema.safeParse(data);

  if (!validatedAuthData.success) {
    return validatedAuthData.error.errors[0];
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const validatedAuthData = authSchema.safeParse(data);

  if (!validatedAuthData.success) {
    return validatedAuthData.error.errors[0];
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    return error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return error;
  }
  if (data.url) {
    redirect(data.url);
  }
}

export async function testChallenge(
  code: string,
  language: Language,
  challengeId: string,
): Promise<Submission> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      redirect("/login");
    }

    userCodeSchema.parse({
      code,
      language: language.toLowerCase(),
      challengeId,
    });

    const submission = await prismadb.submission.create({
      data: {
        code,
        userId: user.id,
        status: "PENDING",
        language,
        challengeId,
        testResults: null as unknown as PrismaJson.TestResultsType,
      },
    });

    const challenge = await prismadb.challenge.findFirst({
      where: {
        id: challengeId,
      },
      select: {
        testCases: true,
      },
    });

    const languageTopicMap: Record<string, string> = {
      javascript: "nodejs-submission-topic",
      python: "python-submission-topic",
    };

    const topic = languageTopicMap[language.toLowerCase()];

    if (!topic) {
      throw new Error(`Unsupported language: ${language}`);
    }

    await sendKafkaMessage(topic, {
      submissionId: submission.id,
      code: code,
      testCases: challenge!.testCases,
    });

    console.log("Message sent successfully");

    const result = await pollSubmissionResult(submission.id, language);

    const data = await prismadb.submission.update({
      where: {
        id: submission.id,
      },
      data: {
        testResults: result.testResults,
        status: result.success ? "SUCCESS" : "FAIL",
        globalError: result.globalError,
      },
    });

    const sanitizedTestResults = data.testResults
      .map((testResult) =>
        testResult.hidden
          ? {
              input: null,
              expectedOutput: null,
              actualOutput: null,
              passed: testResult.passed,
              logs: [],
              error: null,
              hidden: testResult.hidden,
            }
          : testResult,
      )
      .sort((a, b) => {
        if (a.hidden === b.hidden) return 0;
        return a.hidden ? 1 : -1;
      });

    return {
      ...data,
      testResults: sanitizedTestResults,
    };
  } catch (error) {
    console.error("Error in testChallenge:", error);
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}

export async function createNewChallenge(data: TChallengeSchema) {
  try {
    createChallengeSchema.parse(data);

    const processedTestCases = data.challengeTestCases.map((testCase) => ({
      ...testCase,
      inputs: testCase.inputs.map((input) => ({
        ...input,
        value: JSON.parse(input.value),
      })),
      expectedOutput: JSON.parse(testCase.expectedOutput),
    }));

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Authentication error:", error.message);
      throw new AuthError(
        "Authentication failed. Please log in and try again.",
      );
    }

    if (!user) {
      console.error("No user found.");
      throw new AuthError(
        "You are not authenticated. Please log in to proceed.",
      );
    }

    return await prismadb.challenge.create({
      data: {
        title: data.challengeTitle.split(" ").join("-").toLowerCase(),
        description: data.challengeDescription,
        descriptionSnippet: data.challengeSnippetDescription,
        difficulty: data.challengeDifficulty,
        testCases: processedTestCases,
        creatorId: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      console.error("Error in createNewChallenge:", error);
      redirect("/login");
    }
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}
