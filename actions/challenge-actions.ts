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
  processTestCases,
  sanitizeTestResults,
  submissionTopicMap,
} from "@/lib/utils";
import { randomUUID } from "node:crypto";
import { AuthError } from "@supabase/auth-js";
import { pollSubmissionResult, sendKafkaMessage } from "@/lib/kafka/client";
import { authorizeUser } from "@/actions/auth-actions";

export async function handleNewSubmission(
  code: string,
  language: Language,
  challengeId: string,
): Promise<Submission & { challenge: Pick<Challenge, "title"> }> {
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
      throw new Error(`Could not find challenge with id: ${challengeId}`);
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
      return data;
    }

    const sanitizedTestResults = sanitizeTestResults(data.testResults);

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
    challengeSchema.parse(data);

    const processedTestCases = processTestCases(data.testCases);

    const { user } = await authorizeUser();

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
      redirect("/sign-in");
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

    const processedTestCases = processTestCases(data.testCases);

    const { user } = await authorizeUser();

    const challenge = await prismadb.challenge.update({
      where: {
        id: challengeId,
        authorId: user.id,
      },
      data: {
        title: data.title.split(" ").join("-").toLowerCase(),
        description: data.description,
        descriptionSnippet: data.descriptionSnippet,
        difficulty: data.difficulty,
        testCases: processedTestCases,
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
      redirect("/sign-in");
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
    const { user } = await authorizeUser();

    return await prismadb.challenge.delete({
      where: {
        id: challengeId,
        authorId: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(
      "An error occurred while deleting challenge. Please try again.",
    );
  }
}
