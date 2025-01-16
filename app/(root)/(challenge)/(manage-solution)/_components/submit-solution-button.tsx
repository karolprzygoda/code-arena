"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { solutionSchema, TSolutionSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createNewSolution, updateSolution } from "@/actions/solutions-actions";
import { useRouter } from "next/navigation";
import useMarkdownContext from "@/hooks/use-markdown-context";
import { useShallow } from "zustand/react/shallow";

type SubmitSolutionButtonProps = {
  initialData: TSolutionSchema;
  challengeTitle: string;
  solutionId?: string;
};

const SubmitSolutionButton = ({
  initialData,
  challengeTitle,
  solutionId,
}: SubmitSolutionButtonProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [open, setOpen] = useState(false);

  const form = useForm<TSolutionSchema>({
    resolver: zodResolver(solutionSchema),
    defaultValues: initialData,
  });

  const router = useRouter();

  const { markdown } = useMarkdownContext(
    useShallow((state) => ({
      markdown: state.markdown,
    })),
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  async function onSubmit(data: TSolutionSchema) {
    try {
      const { solution, message, error } = solutionId
        ? await updateSolution(data, solutionId)
        : await createNewSolution(data);

      if (!solution || error) {
        toast.error(error);
      } else {
        toast.success(message);
        router.push(`/challenge/${challengeTitle}/solutions/${solution.id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  }

  function onError(errors: FieldErrors<TSolutionSchema>) {
    if (errors.description?.message) {
      toast.error(errors.description.message);
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.setValue("description", markdown);
    form.handleSubmit(onSubmit, onError)();
  };

  const isSubmitting = form.formState.isSubmitting;

  if (isDesktop) {
    return (
      <AlertDialog open={open}>
        <AlertDialogTrigger asChild>
          <Button onClick={handleOpen} size={"sm"} className={"font-semibold"}>
            Continue
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Please provide title for your solution.
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide data below to add your code to the markdown.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className={"mt-3 flex flex-col gap-6"}>
                <div className="grid w-full items-center gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            type={"title"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <AlertDialogFooter className={"mt-3"}>
                <AlertDialogCancel onClick={handleClose}>
                  Cancel
                </AlertDialogCancel>
                <Button type={"submit"} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Continue"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer modal open={open}>
      <DrawerTrigger asChild>
        <Button onClick={handleOpen} size={"sm"} className={"font-semibold"}>
          Continue
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <DrawerHeader className="text-left">
              <DrawerTitle>Please provide title for your solution.</DrawerTitle>
              <DrawerDescription>
                Please provide data below to add your code to the markdown.
              </DrawerDescription>
            </DrawerHeader>
            <div className={"mt-3 flex flex-col gap-6 px-4"}>
              <div className="grid w-full items-center gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          type={"title"}
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DrawerFooter className={"mt-3 gap-4"}>
              <DrawerClose onClick={handleClose} asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type={"submit"} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default SubmitSolutionButton;
