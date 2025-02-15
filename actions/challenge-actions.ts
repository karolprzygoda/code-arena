"use server";

import { Challenge, Language, Prisma, Submission } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  challengeSchema,
  TChallengeSchema,
  userCodeSchema,
} from "@/schemas/schema";
import prismadb from "@/lib/prismadb";
import {
  formPascalCaseToKebabCase,
  parseTestCases,
  sanitizeTestResults,
  submissionTopicMap,
} from "@/lib/utils";
import { randomUUID } from "node:crypto";
import { AuthError } from "@supabase/auth-js";
import { pollSubmissionResult, sendKafkaMessage } from "@/lib/kafka/client";
import { authorizeUser } from "@/actions/auth-actions";
import { revalidatePath } from "next/cache";

export async function handleNewSubmission(
  code: string,
  language: Language,
  challengeId: string,
): Promise<{
  submission:
    | (Submission & {
        challenge: Pick<Challenge, "title">;
      })
    | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      redirect("/sign-in");
    }

    userCodeSchema.parse({
      code,
      language: language.toLowerCase(),
      challengeId,
    });

    const challenge = await prismadb.challenge.findFirst({
      where: {
        id: challengeId,
      },
      select: {
        testCases: true,
      },
    });

    if (!challenge) {
      return {
        submission: null,
        error: `Could not find challenge with id: ${challengeId}`,
      };
    }

    const topic = submissionTopicMap[language.toLowerCase()];

    if (!topic) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const kafkaMessageId = randomUUID();

    await sendKafkaMessage(topic, {
      kafkaMessageId,
      code: code,
      testCases: challenge.testCases,
    });

    console.log("Message sent successfully");

    const result = await pollSubmissionResult(kafkaMessageId, language);

    const data = await prismadb.submission.create({
      data: {
        testResults: result.testResults,
        status: result.success ? "SUCCESS" : "FAIL",
        globalError: result.globalError,
        challengeId: challengeId,
        userId: user.id,
        language: language,
        code: code,
      },
      include: {
        challenge: {
          select: {
            title: true,
          },
        },
      },
    });

    if (data.globalError || !data.testResults) {
      return { submission: data, error: null };
    }

    const sanitizedTestResults = sanitizeTestResults(data.testResults);

    return {
      submission: {
        ...data,
        testResults: sanitizedTestResults,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in testChallenge:", error);

    return {
      submission: null,
      error: "Unknown Error Occurred",
    };
  }
}

export async function createNewChallenge(data: TChallengeSchema) {
  try {
    challengeSchema.parse(data);

    const processedTestCases = parseTestCases(data.testCases);

    const { user, error } = await authorizeUser();

    if (!user || error) {
      throw error;
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

    revalidatePath(`/explore/${challenge.difficulty.toLowerCase()}`);
    revalidatePath(`/challenge/${challenge.title}`);

    return {
      challenge,
      message: "Successfully created new challenge",
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      console.error("Error in createNewChallenge:", error);
      redirect("/sign-in");
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        challenge: null,
        message: null,
        error: "Challenge with provided title already exists.",
      };
    }
    return {
      challenge: null,
      message: null,
      error: "An unexpected error occurred try again or contact with support.",
    };
  }
}

export async function updateChallenge(
  data: TChallengeSchema,
  challengeId: string,
) {
  try {
    challengeSchema.parse(data);

    const processedTestCases = parseTestCases(data.testCases);

    const { user, error } = await authorizeUser();

    if (!user || error) {
      throw error;
    }

    const challenge = await prismadb.challenge.update({
      where: {
        id: challengeId,
        authorId: user.id,
      },
      data: {
        title: formPascalCaseToKebabCase(data.title),
        description: data.description,
        descriptionSnippet: data.descriptionSnippet,
        difficulty: data.difficulty,
        testCases: processedTestCases,
      },
    });

    revalidatePath(`/`);
    revalidatePath(`/explore/${challenge.difficulty.toLowerCase()}`);
    revalidatePath(`/challenge/${challenge.title}`);

    return {
      challenge,
      message: `Successfully updated ${data.title} challenge`,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      console.error("Error in updateChallenge:", error);
      redirect("/sign-in");
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        challenge: null,
        message: null,
        error: "Challenge with provided title already exists.",
      };
    }
    return {
      challenge: null,
      message: null,
      error: "An unexpected error occurred try again or contact with support.",
    };
  }
}

export async function deleteChallenge(challengeId: string) {
  try {
    const { user, error } = await authorizeUser();

    if (!user || error) {
      throw error;
    }

    const deletedChallenge = await prismadb.challenge.delete({
      where: {
        id: challengeId,
        authorId: user.id,
      },
    });

    revalidatePath(`/`);
    revalidatePath(`/explore/${deletedChallenge.difficulty.toLowerCase()}`);
    revalidatePath(`/challenge/${deletedChallenge.title}`);

    return {
      deletedChallenge,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      deletedChallenge: null,
      error: "An error occurred while deleting challenge. Please try again.",
    };
  }
}
