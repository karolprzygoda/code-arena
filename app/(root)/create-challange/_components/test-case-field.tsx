import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TChallangeSchema } from "@/schemas/schema";

type TestCaseFieldProps = {
  form: UseFormReturn<TChallangeSchema>;
  testCaseIndex: number;
  onRemove: () => void;
  showRemoveButton: boolean;
};

const TestCaseField = ({
  form,
  testCaseIndex,
  onRemove,
  showRemoveButton,
}: TestCaseFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    name: `challangeTestCases.${testCaseIndex}.inputs`,
    control: form.control,
  });

  return (
    <Card>
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0">
        <CardTitle>Test Case {testCaseIndex + 1}</CardTitle>
        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className={"absolute right-6 h-fit w-fit p-2"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, inputIndex) => (
            <div
              key={field.id}
              className="flex flex-col items-start gap-4 lg:flex-row"
            >
              <FormField
                control={form.control}
                name={`challangeTestCases.${testCaseIndex}.inputs.${inputIndex}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-2">
                    <FormLabel>Input Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., number1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`challangeTestCases.${testCaseIndex}.inputs.${inputIndex}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-2">
                    <FormLabel>Input Value</FormLabel>
                    <div className={"flex items-center"}>
                      <FormControl>
                        <Input placeholder="e.g., 42" {...field} />
                      </FormControl>

                      {fields.length > 1 && (
                        <Button
                          className={"ms-2"}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(inputIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={"w-full lg:w-fit"}
            onClick={() => append({ name: "", value: "" })}
          >
            <Plus className="h-4 w-4" />
            Add Input
          </Button>
        </div>
        <FormField
          control={form.control}
          name={`challangeTestCases.${testCaseIndex}.expectedOutput`}
          render={({ field }) => (
            <FormItem className={"space-y-2"}>
              <FormLabel>Expected Output</FormLabel>
              <FormControl>
                <Input placeholder="Expected result" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TestCaseField;
