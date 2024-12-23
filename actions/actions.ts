"use server";

import {
  authSchema,
  TAuthSchema,
  TChallangeSchema,
  userCodeSchema,
} from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Language, Submission } from "@prisma/client";
import { pollSubmissionResult, sendKafkaMessage } from "@/lib/utils";

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

    const challange = await prismadb.challenge.findFirst({
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
      testCases: challange!.testCases,
    });

    console.log("Message sent successfully");

    const result = await pollSubmissionResult(submission.id, language);

    return await prismadb.submission.update({
      where: {
        id: submission.id,
      },
      data: {
        testResults: result.testResults,
        status: result.success ? "SUCCESS" : "FAIL",
        globalError: result.globalError,
      },
    });
  } catch (error) {
    console.error("Error in testChallenge:", error);
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}

export async function createNewChallange(data: TChallangeSchema) {
  try {
    const processedTestCases = data.challangeTestCases.map((testCase) => ({
      ...testCase,
      inputs: testCase.inputs.map((input) => ({
        ...input,
        value: JSON.parse(input.value),
      })),
      expectedOutput: JSON.parse(testCase.expectedOutput),
    }));

    return await prismadb.challenge.create({
      data: {
        title: data.challangeTitle.split(" ").join("-").toLowerCase(),
        description: data.description,
        difficulty: data.challangeDifficulty,
        testCases: processedTestCases,
      },
    });
  } catch (error) {
    console.error("Error in createNewChallange:", error);
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}
