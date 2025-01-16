"use server";

import { solutionSchema, TSolutionSchema } from "@/schemas/schema";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { AuthError } from "@supabase/auth-js";
import { revalidatePath } from "next/cache";

export async function createNewSolution(data: TSolutionSchema) {
  try {
    solutionSchema.parse(data);

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect("/sign-in");
    }

    const solution = await prismadb.solution.create({
      data: {
        authorId: user.id,
        language: data.language,
        challengeId: data.challengeId,
        title: data.title,
        description: data.description,
      },
      include: {
        challenge: {
          select: {
            title: true,
          },
        },
      },
    });

    revalidatePath(`/challenge/${solution.challenge.title}/solutions}`);
    revalidatePath(
      `/challenge/${solution.challenge.title}/solutions/${solution.id}`,
    );

    return {
      solution,
      message: "Successfully created new solution",
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      solution: null,
      message: null,
      error: "An unexpected error occurred try again or contact with support.",
    };
  }
}

export async function deleteSolution(solutionId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      throw new AuthError("Could not authenticate user");
    }

    const deletedSolution = await prismadb.solution.delete({
      where: {
        id: solutionId,
        authorId: user.id,
      },
      include: {
        challenge: {
          select: {
            title: true,
          },
        },
      },
    });

    revalidatePath(`/challenge/${deletedSolution.challenge.title}/solutions}`);
    revalidatePath(
      `/challenge/${deletedSolution.challenge.title}/solutions/${solutionId}`,
    );

    return {
      deletedSolution,
      error: null,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      redirect("/sign-in");
    }

    return {
      deletedSolution: null,
      error: "An error occurred while deleting challenge. Please try again.",
    };
  }
}

export async function updateSolution(
  data: TSolutionSchema,
  solutionId: string,
) {
  try {
    solutionSchema.parse(data);

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      throw new AuthError("Could not authenticate user");
    }

    const solution = await prismadb.solution.update({
      where: {
        id: solutionId,
        authorId: user.id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        challenge: {
          select: {
            title: true,
          },
        },
      },
    });

    revalidatePath(`/challenge/${solution.challenge.title}/solutions}`);
    revalidatePath(
      `/challenge/${solution.challenge.title}/solutions/${solutionId}`,
    );

    return {
      solution: solution,
      message: `Successfully updated ${solution.title} solution`,
      error: null,
    };
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      redirect("/sign-in");
    }

    return {
      deletedSolution: null,
      message: null,
      error: "An error occurred while deleting challenge. Please try again.",
    };
  }
}
