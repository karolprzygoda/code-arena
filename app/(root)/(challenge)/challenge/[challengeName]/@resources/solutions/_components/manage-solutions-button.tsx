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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { deleteSolution } from "@/actions/solutions-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUser from "@/hooks/use-user";

type ManageSolutionButtonProps = {
  solutionId: string;
  authorId: string;
};

const ManageSolutionButton = ({
  solutionId,
  authorId,
}: ManageSolutionButtonProps) => {
  const router = useRouter();
  const user = useUser();

  const handleDelete = async () => {
    try {
      const { deletedSolution, error } = await deleteSolution(solutionId);

      if (!deletedSolution || error) {
        toast.error(error);
      } else {
        toast.success(`Successfully deleted ${deletedSolution.title} solution`);
        router.push(`/challenge/${deletedSolution.challenge.title}/solutions`);
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
    router.push(`/update-solution/${solutionId}`);
  };

  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={"Expand to see more actions"}
                  variant={"ghost"}
                  className={"h-fit rounded-full p-2 hover:bg-zinc-700"}
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Expand to see more actions</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          align="end"
          className="mt-[0.33rem] w-44 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
        >
          <DropdownMenuLabel>Mange Solution</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"rounded-md"}>
            <button
              onClick={handleUpdate}
              className={"flex h-full w-full items-center justify-start gap-2"}
            >
              <FilePenLine className={"h-4 w-4"} />
              Edit Solution
            </button>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <Button
              className={cn(
                "h-8 w-full justify-start bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500",
              )}
              variant="ghost"
            >
              <span className="flex items-center gap-2 text-red-500">
                <Trash className={"h-5 w-5"} />
                Delete Solution
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
            solution from our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ManageSolutionButton;
