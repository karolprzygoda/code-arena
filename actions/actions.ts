"use server";

import {
  authSchema,
  challengeSchema,
  TAuthSchema,
  TChallengeSchema,
  userCodeSchema,
} from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Challenge, Language, Prisma, Submission } from "@prisma/client";
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
): Promise<Submission & { challenge: Challenge }> {
  let submissionId: string | undefined = undefined;

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

    submissionId = submission.id;

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
      include: {
        challenge: true,
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
              memoryUsage: testResult.memoryUsage,
              executionTime: testResult.executionTime,
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

    if (submissionId) {
      try {
        await prismadb.submission.delete({
          where: {
            id: submissionId,
            status: "PENDING",
          },
        });
        console.log(`Cleaned up pending submission ${submissionId}`);
      } catch (cleanupError) {
        console.error("Error cleaning up pending submission:", cleanupError);
      }
    }

    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}

export async function createNewChallenge(data: TChallengeSchema) {
  try {
    challengeSchema.parse(data);

    const processedTestCases = data.testCases.map((testCase) => ({
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

    const isAdmin = await prismadb.userRoles.findFirst({
      where: {
        userid: user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      throw new Error(
        "Unauthenticated. You do not have permission to perform this action.",
      );
    }

    const challenge = await prismadb.challenge.create({
      data: {
        title: data.title.split(" ").join("-").toLowerCase(),
        description: data.description,
        descriptionSnippet: data.descriptionSnippet,
        difficulty: data.difficulty,
        testCases: processedTestCases,
        authorId: user.id,
      },
    });

    return {
      challenge,
      message: "Successfully created new challenge",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      console.error("Error in createNewChallenge:", error);
      redirect("/login");
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Challenge with provided title already exists.");
    }
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}

export async function updateChallenge(
  data: TChallengeSchema,
  challengeId: string,
) {
  try {
    challengeSchema.parse(data);

    const processedTestCases = data.testCases.map((testCase) => ({
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

    const isAdmin = await prismadb.userRoles.findFirst({
      where: {
        userid: user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      throw new Error(
        "Unauthenticated. You do not have permission to perform this action.",
      );
    }

    const challenge = await prismadb.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        title: data.title.split(" ").join("-").toLowerCase(),
        description: data.description,
        descriptionSnippet: data.descriptionSnippet,
        difficulty: data.difficulty,
        testCases: processedTestCases,
        authorId: user.id,
      },
    });

    return {
      challenge,
      message: `Successfully updated ${challenge.title
        .split("-")
        .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
        .join(" ")} challenge`,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      console.error("Error in createNewChallenge:", error);
      redirect("/login");
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Challenge with provided title already exists.");
    }
    throw new Error(
      "An unexpected error occurred try again or contact with support.",
    );
  }
}

export async function deleteChallenge(challengeId: string) {
  try {
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

    const isAdmin = await prismadb.userRoles.findFirst({
      where: {
        userid: user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      throw new Error(
        "Unauthenticated. You do not have permission to perform this action.",
      );
    }

    return await prismadb.challenge.delete({
      where: {
        id: challengeId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(
      "An error occurred while deleting challenge. Please try again.",
    );
  }
}

export async function upVote(itemId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("Unauthenticated: Please log in to vote.");

    const existingVote = await prismadb.votes.findFirst({
      where: {
        itemId: itemId,
        userId: user.id,
      },
    });

    if (existingVote) {
      await prismadb.votes.delete({
        where: {
          id: existingVote.id,
        },
      });

      if (existingVote.voteType !== "UPVOTE") {
        await prismadb.votes.create({
          data: {
            itemId: itemId,
            userId: user.id,
            voteType: "UPVOTE",
          },
        });
      }
    } else {
      await prismadb.votes.create({
        data: {
          itemId: itemId,
          userId: user.id,
          voteType: "UPVOTE",
        },
      });
    }
  } catch (error) {
    console.error("Error in upVote:", error);
    throw new Error("An error occurred while voting. Please try again.");
  }
}

export async function downVote(itemId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("Unauthenticated: Please log in to vote.");

    const existingVote = await prismadb.votes.findFirst({
      where: {
        itemId: itemId,
        userId: user.id,
      },
    });

    if (existingVote) {
      await prismadb.votes.delete({
        where: {
          id: existingVote.id,
        },
      });

      if (existingVote.voteType !== "DOWNVOTE") {
        await prismadb.votes.create({
          data: {
            itemId: itemId,
            userId: user.id,
            voteType: "DOWNVOTE",
          },
        });
      }
    } else {
      await prismadb.votes.create({
        data: {
          itemId: itemId,
          userId: user.id,
          voteType: "DOWNVOTE",
        },
      });
    }
  } catch (error) {
    console.error("Error in downVote", error);
    throw new Error("An error occurred while voting. Please try again.");
  }
}
