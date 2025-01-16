"use server";

import { createClient } from "@/lib/supabase/server";
import prismadb from "@/lib/prismadb";
import { VotableItems } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function upVote(
  itemId: string,
  itemType: VotableItems,
  paths?: string[],
) {
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
        [itemType]: itemId,
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
            [itemType]: itemId,
            userId: user.id,
            voteType: "UPVOTE",
          },
        });
      }
    } else {
      await prismadb.votes.create({
        data: {
          [itemType]: itemId,
          userId: user.id,
          voteType: "UPVOTE",
        },
      });
    }

    if (paths) {
      paths.forEach((path) => revalidatePath(path));
    }

    return { error: null };
  } catch (error) {
    console.error("Error in upVote:", error);
    return { error: "An error occurred while voting. Please try again." };
  }
}

export async function downVote(
  itemId: string,
  itemType: VotableItems,
  paths?: string[],
) {
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
        [itemType]: itemId,
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
            [itemType]: itemId,
            userId: user.id,
            voteType: "DOWNVOTE",
          },
        });
      }
    } else {
      await prismadb.votes.create({
        data: {
          [itemType]: itemId,
          userId: user.id,
          voteType: "DOWNVOTE",
        },
      });
    }

    if (paths) {
      paths.forEach((path) => revalidatePath(path));
    }

    return { error: null };
  } catch (error) {
    console.error("Error in downVote", error);
    return { error: "An error occurred while voting. Please try again." };
  }
}

export async function getSolvedChallenges() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect("/sign-in");
    }

    const solvedChallenges = await prismadb.challenge.findMany({
      where: {
        submission: {
          some: {
            status: "SUCCESS",
            userId: user.id,
          },
        },
      },
      select: {
        difficulty: true,
      },
    });

    return {
      solvedChallenges,
      error: null,
    };
  } catch (error) {
    console.log("Error occurred in getSolvedChallenges", error);
    return {
      solvedChallenges: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function getUserVoteType(itemId: string, itemType: VotableItems) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect("/sign-in");
    }

    const userVote = await prismadb.votes.findFirst({
      where: { [itemType]: itemId, userId: user.id },
      select: {
        voteType: true,
      },
    });

    return {
      userVote,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      userVote: null,
      error: "An unexpected error occurred please try again later.",
    };
  }
}
