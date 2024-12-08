"use server";

import { StateType } from "@/lib/types";
import { TAuthSchema } from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Language, Submission } from "@prisma/client";
import { pollSubmissionResult, sendKafkaMessage } from "@/lib/utils";

export async function login(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      title: "Error",
      description: error.message,
      variant: "destructive",
    } as StateType;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: TAuthSchema) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      title: "Error",
      description: error.message,
      variant: "destructive",
    } as StateType;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginWithGitHub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000",
    },
  });

  console.log(data, error);

  if (error) {
    return {
      title: "Error",
      description: error.message,
      variant: "destructive",
    } as StateType;
  } else {
    return redirect(data.url);
  }
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  console.log(data, error);

  if (error) {
    return {
      title: "Error",
      description: error.message,
      variant: "destructive",
    } as StateType;
  } else {
    return redirect(data.url);
  }
}

export const testChallenge = async (
  code: string,
  language: Language,
  challengeId: string,
): Promise<Submission> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      redirect("/login");
    }

    const submission = await prismadb.submission.create({
      data: {
        code,
        userId: user.id,
        status: "PENDING",
        language,
        challengeId,
        testResults: { test: null },
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

    console.log("Producer connected to Kafka");

    await sendKafkaMessage("nodejs-submission-topic", {
      submissionId: submission.id,
      code: code,
      testCases: challange!.testCases,
    });

    console.log("Message sent successfully");

    const result = await pollSubmissionResult(submission.id);

    return await prismadb.submission.update({
      where: {
        id: submission.id,
      },
      data: {
        testResults: result.testResults,
        status: result.success ? "SUCCESS" : "FAIL",
      },
    });
  } catch (error) {
    console.error("Error in testChallenge:", error);
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
};
