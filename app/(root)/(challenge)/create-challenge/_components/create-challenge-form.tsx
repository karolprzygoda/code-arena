"use client";

import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  createChallengeSchema,
  TChallengeSchema,
  testCasesSchema,
  TTestCasesSchema,
} from "@/schemas/schema";
import { toast } from "@/hooks/use-toast";
import { ChangeEvent, useEffect, useRef } from "react";
import { createNewChallenge } from "@/actions/actions";
import { useRouter } from "next/navigation";
import TestCaseFormField from "@/app/(root)/(challenge)/create-challenge/_components/test-case-form-field";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import PanelFooter from "@/app/(root)/(challenge)/_components/panel-footer";

const CreateChallengeForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);
  const router = useRouter();

  const form = useForm<TChallengeSchema>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      challengeDescription: "",
      challengeTitle: "",
      challengeDifficulty: "EASY",
      challengeSnippetDescription: "",
      challengeTestCases: [
        {
          inputs: [{ name: "", value: "" }],
          expectedOutput: "",
          hidden: false,
        },
      ],
    },
  });

  useEffect(() => {
    form.setValue(
      "challengeDescription",
      useMarkdownEditorStore.getState().markdown,
    );
  }, [form]);

  const isSubmitting = form.formState.isSubmitting;

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    name: "challengeTestCases",
    control: form.control,
  });

  async function onSubmit(data: TChallengeSchema) {
    const challenge = await createNewChallenge(data);

    if (challenge) {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully created new challenge",
      });

      useMarkdownEditorStore.getState().setMarkdown("");
      router.push(`/challenge/${challenge.title}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unknown error occurred",
      });
    }
  }

  function onError(errors: FieldErrors<TChallengeSchema>) {
    if (errors.challengeTestCases?.root) {
      toast({
        title: "Error!",
        variant: "destructive",
        description: errors.challengeTestCases.root.message,
      });
    }

    if (errors.challengeDescription?.message) {
      toast({
        title: "Error!",
        variant: "destructive",
        description: errors.challengeDescription.message,
      });
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const testCases: TTestCasesSchema = JSON.parse(text);

      testCasesSchema.parse(testCases);

      if (testCaseFields.length === 1) {
        removeTestCase();
      }

      testCases.forEach((testCase) => {
        appendTestCase(testCase);
      });

      toast({
        variant: "success",
        title: "Test Cases Imported",
        description: "Successfully imported test cases from the JSON file.",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to import test cases. Please check your JSON file.",
      });
    } finally {
      event.target.files = null;
      event.target.value = "";
    }
  }

  if (!hasHydrated) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="w-full lg:w-1/2"
      >
        <RootPanelWrapper>
          <PanelHeader>
            <span className={"ms-3 text-xs font-semibold"}>
              Crete new Challenge
            </span>
          </PanelHeader>
          <ScrollArea className={"flex-1"}>
            <div className={"flex flex-col gap-6 p-6"}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                  <FormField
                    control={form.control}
                    name="challengeTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Two Sum" type="text" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is title of your challenge.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <FormField
                    control={form.control}
                    name="challengeDifficulty"
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
                          Choose difficulty of your challenge.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="challengeSnippetDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description Snippet</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Create function that will sum two variables."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write small description of your challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={"flex flex-1 flex-col space-y-2 overflow-hidden"}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Test Cases</h2>
                </div>
                <FormItem className={"flex flex-col gap-4"}>
                  {testCaseFields.map((field, testCaseIndex) => (
                    <TestCaseFormField
                      key={field.id}
                      form={form}
                      testCaseIndex={testCaseIndex}
                      onRemove={() => removeTestCase(testCaseIndex)}
                      showRemoveButton={testCaseFields.length > 1}
                    />
                  ))}
                </FormItem>
              </div>
            </div>
          </ScrollArea>
          <PanelFooter>
            <div className={"flex gap-2"}>
              <Button
                type="button"
                variant={"outline"}
                className={"font-semibold"}
                onClick={() =>
                  appendTestCase({
                    inputs: [{ name: "", value: "" }],
                    expectedOutput: "",
                    hidden: false,
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
            <Button className={"rounded-xl font-semibold"} type={"submit"}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </PanelFooter>
        </RootPanelWrapper>
      </form>
    </Form>
  );
};

export default CreateChallengeForm;
