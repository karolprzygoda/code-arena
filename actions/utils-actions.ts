"use server";

import { createClient } from "@/lib/supabase/server";
import prismadb from "@/lib/prismadb";

export async function upVote(
  itemId: string,
  itemType: "challengeId" | "solutionId",
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
  } catch (error) {
    console.error("Error in upVote:", error);
    throw new Error("An error occurred while voting. Please try again.");
  }
}

export async function downVote(
  itemId: string,
  itemType: "challengeId" | "solutionId",
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
  } catch (error) {
    console.error("Error in downVote", error);
    throw new Error("An error occurred while voting. Please try again.");
  }
}
