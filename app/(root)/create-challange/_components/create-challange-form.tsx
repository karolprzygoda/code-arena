"use client";

import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileJson, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TestCaseField from "@/app/(root)/create-challange/_components/test-case-field";
import { createChallangeSchema, TChallangeSchema } from "@/schemas/schema";
import { toast } from "@/hooks/use-toast";
import { ChangeEvent, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createNewChallange } from "@/actions/actions";
import MarkdownWrapper from "@/app/(root)/create-challange/edit-description/_components/markdown-wrapper";
import { useRouter } from "next/navigation";

const CreateChallangeForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);
  const router = useRouter();

  const form = useForm<TChallangeSchema>({
    resolver: zodResolver(createChallangeSchema),
    defaultValues: {
      description: "",
      challangeTitle: "",
      challangeDifficulty: "EASY",
      challangeDescription: "",
      challangeTestCases: [
        {
          inputs: [{ name: "", value: "" }],
          expectedOutput: "",
        },
      ],
    },
  });

  useEffect(() => {
    form.setValue("description", useMarkdownEditorStore.getState().markdown);
  }, [form]);

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    name: "challangeTestCases",
    control: form.control,
  });

  async function onSubmit(data: TChallangeSchema) {
    const challange = await createNewChallange(data);

    if (challange) {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully created new challange",
      });

      useMarkdownEditorStore.getState().setMarkdown("");
      router.push(`/challange/${challange.title}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unknown error occurred",
      });
    }
  }

  function onError(errors: FieldErrors<TChallangeSchema>) {
    if (errors.challangeTestCases?.root) {
      toast({
        title: "Error!",
        variant: "destructive",
        description: errors.challangeTestCases.root.message,
      });
    }

    if (errors.description?.message) {
      toast({
        title: "Error!",
        variant: "destructive",
        description: errors.description.message,
      });
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (Array.isArray(json)) {
        if (testCaseFields.length === 1) {
          removeTestCase();
        }

        json.forEach((testCase) => {
          if (
            testCase.inputs &&
            Array.isArray(testCase.inputs) &&
            typeof testCase.expectedOutput !== "undefined"
          ) {
            appendTestCase(testCase);
          }
        });

        toast({
          variant: "success",
          title: "Test Cases Imported",
          description: "Successfully imported test cases from the JSON file.",
        });

        event.target.files = null;
        event.target.value = "";
      } else {
        throw new Error("Invalid JSON format");
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to import test cases. Please check your JSON file.",
      });
    }
  }

  if (!hasHydrated) {
    return null;
  }

  return (
    <div
      className={
        "flex h-full w-full flex-col-reverse gap-4 overflow-auto px-4 pb-4 pt-2 lg:flex-row lg:overflow-hidden lg:pt-0"
      }
    >
      <PanelWrapper
        className={
          "relative min-h-full w-full overflow-hidden rounded-xl dark:border-zinc-700 dark:bg-zinc-800 lg:w-1/2"
        }
      >
        <div
          className={
            "sticky top-0 flex min-h-[44px] items-center justify-end border-b border-zinc-300 p-1 dark:border-zinc-700"
          }
        >
          <Link href={"/create-challange/edit-description"}>
            <Button variant={"link"} className={"font-semibold"} size={"sm"}>
              Edit description
            </Button>
          </Link>
        </div>
        <MarkdownWrapper />
      </PanelWrapper>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="w-full lg:w-1/2"
        >
          <Card className={"flex h-full flex-col overflow-hidden"}>
            <CardHeader
              className={
                "flex min-h-[44px] flex-row items-center justify-start border-b px-6 py-1 text-xs font-semibold"
              }
            >
              <CardTitle>Crete new Challange</CardTitle>
            </CardHeader>

            <ScrollArea className={"flex-1"}>
              <CardContent className={"flex flex-col gap-6 pt-6"}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-6">
                    <FormField
                      control={form.control}
                      name="challangeTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Challange Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Two Sum"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is title of your challange.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormField
                      control={form.control}
                      name="challangeDifficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue={"EASY"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EASY">Easy</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose difficulty of your challange.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="challangeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quick Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Create function that will sum two variables."
                          className="h-28 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Write small description of your challange.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={"flex flex-1 flex-col space-y-2 overflow-hidden"}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">Test Cases</h2>
                  </div>
                  <FormItem className={"flex flex-col gap-4"}>
                    {testCaseFields.map((field, testCaseIndex) => (
                      <TestCaseField
                        key={field.id}
                        form={form}
                        testCaseIndex={testCaseIndex}
                        onRemove={() => removeTestCase(testCaseIndex)}
                        showRemoveButton={testCaseFields.length > 1}
                      />
                    ))}
                  </FormItem>
                </div>
              </CardContent>
            </ScrollArea>
            <CardFooter className={"justify-between border-t py-3"}>
              <div className={"flex gap-2"}>
                <Button
                  type="button"
                  variant={"outline"}
                  className={"font-semibold"}
                  onClick={() =>
                    appendTestCase({
                      inputs: [{ name: "", value: "" }],
                      expectedOutput: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  <span className={"hidden sm:inline"}>Add Test Case</span>
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className={"relative px-2"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileJson className="h-4 w-4" />
                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                </Button>
              </div>
              <Button size={"sm"} className={"font-semibold"} type={"submit"}>
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CreateChallangeForm;
