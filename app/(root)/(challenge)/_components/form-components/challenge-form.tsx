"use client";

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
  challengeSchema,
  TChallengeSchema,
  testCasesSchema,
  TTestCasesSchema,
} from "@/schemas/schema";
import { ChangeEvent, FormEvent, useRef } from "react";
import {
  createNewChallenge,
  updateChallenge,
} from "@/actions/challenge-actions";
import { useRouter } from "next/navigation";
import TestCaseFormField from "@/app/(root)/(challenge)/_components/form-components/test-case-form-field";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import PanelFooter from "@/app/(root)/(challenge)/_components/panel-footer";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import useMarkdownContext from "@/hooks/use-markdown-context";

type CreateChallengeFormProps = {
  initialData?: TChallengeSchema;
  challengeId?: string;
};

const ChallengeForm = ({
  initialData,
  challengeId,
}: CreateChallengeFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { markdown } = useMarkdownContext(
    useShallow((state) => ({
      markdown: state.markdown,
    })),
  );

  const form = useForm<TChallengeSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: initialData ?? {
      description: "",
      title: "",
      difficulty: "EASY",
      descriptionSnippet: "",
      testCases: [
        {
          inputs: [{ name: "", value: "" }],
          expectedOutput: "",
          hidden: false,
        },
      ],
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    name: "testCases",
    control: form.control,
  });

  async function onSubmit(data: TChallengeSchema) {
    try {
      const { challenge, message } =
        challengeId && initialData
          ? await updateChallenge(data, challengeId)
          : await createNewChallenge(data);

      toast.success(message);

      router.push(`/challenge/${challenge.title}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  }

  function onError(errors: FieldErrors<TChallengeSchema>) {
    if (errors.testCases?.root) {
      toast.error(errors.testCases.root.message);
    }

    if (errors.description?.message) {
      toast.error(errors.description.message);
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

      toast.success("Successfully imported test cases from the JSON file.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to import test cases. Please check your JSON file.");
    } finally {
      event.target.files = null;
      event.target.value = "";
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    form.setValue("description", markdown);
    form.handleSubmit(onSubmit, onError)();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2">
        <fieldset className={"h-full w-full"} disabled={isSubmitting}>
          <RootPanelWrapper>
            <PanelHeader>
              <span className={"ms-3 text-xs font-semibold"}>
                {challengeId ? "Update Challenge" : "Crete new Challenge"}
              </span>
            </PanelHeader>
            <ScrollArea className={"flex-1"}>
              <div className={"flex flex-col gap-6 p-6"}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Challenge Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Two Sum"
                              type="text"
                              {...field}
                            />
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
                      name="difficulty"
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
                  name="descriptionSnippet"
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
                <div
                  className={"flex flex-1 flex-col space-y-2 overflow-hidden"}
                >
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
        </fieldset>
      </form>
    </Form>
  );
};

export default ChallengeForm;
