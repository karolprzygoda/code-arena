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

type ManageSolutionButtonProps = {
  solutionId: string;
};

const ManageSolutionButton = ({ solutionId }: ManageSolutionButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const solution = await deleteSolution(solutionId);
      toast.success(`Successfully deleted ${solution.title} solution`);
      router.push(`/challenge/${solution.challenge.title}/solutions`);
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

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className={"h-fit rounded-full p-2 hover:bg-zinc-700"}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
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
