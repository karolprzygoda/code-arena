"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, FilePenLine, Trash } from "lucide-react";
import { deleteChallenge } from "@/actions/challenge-actions";
import { useRouter } from "next/navigation";
import { cn, fromKebabCaseToPascalCase } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useUserContext } from "@/components/user-context-provider";
import React from "react";
import { PropagationStopper } from "@/components/propagation-stopper";

type ManageChallengeButtonProps = {
  challengeId: string;
  challengeTitle: string;
  blur?: boolean;
};

const ManageChallengeButton = ({
  challengeId,
  challengeTitle,
  blur = true,
}: ManageChallengeButtonProps) => {
  const router = useRouter();
  const { userRole } = useUserContext();

  const handleDelete = async () => {
    try {
      const { deletedChallenge, error } = await deleteChallenge(challengeId);

      if (!deletedChallenge || error) {
        toast.error(error);
      } else {
        toast.success(
          `Successfully deleted ${fromKebabCaseToPascalCase(deletedChallenge.title)} challenge`,
        );
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const handleUpdate = () => {
    router.push(`/update-challenge/${challengeTitle}`);
  };

  if (!userRole) {
    return null;
  }

  return (
    <PropagationStopper>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              aria-label={"expand-options"}
              className={"h-fit rounded-full p-2 hover:bg-zinc-700"}
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "mt-[0.33rem] w-44 rounded-xl bg-white dark:bg-neutral-950",
              blur && "bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50",
            )}
          >
            <DropdownMenuLabel>Mange Challenge</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={"rounded-md"}>
              <button
                onClick={handleUpdate}
                aria-label={"Edit Challenge"}
                className={
                  "flex h-full w-full items-center justify-start gap-2"
                }
              >
                <FilePenLine className={"h-4 w-4"} />
                Edit Challenge
              </button>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <Button
                aria-label={"Delete Challenge"}
                className={cn(
                  "h-8 w-full justify-start bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500",
                )}
                variant="ghost"
              >
                <span className="flex items-center gap-2 text-red-500">
                  <Trash className={"h-5 w-5"} />
                  Delete Challenge
                </span>
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              challenge from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PropagationStopper>
  );
};

export default ManageChallengeButton;
