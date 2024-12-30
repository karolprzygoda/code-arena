import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";
import { Check, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TestAccordionProps = {
  children: ReactNode;
};

const TestAccordion = ({ children }: TestAccordionProps) => {
  return (
    <Accordion
      className={"border border-b-0 dark:border-zinc-700"}
      type="single"
      collapsible
      defaultValue={"test-0"}
    >
      {children}
    </Accordion>
  );
};

type TestAccordionItemProps = {
  children: ReactNode;
  value: string;
};

const TestAccordionItem = ({ children, value }: TestAccordionItemProps) => {
  return (
    <AccordionItem className={"h-auto dark:border-zinc-700"} value={value}>
      {children}
    </AccordionItem>
  );
};

type TestAccordionContentProps = {
  children: ReactNode;
};

const TestAccordionContent = ({ children }: TestAccordionContentProps) => {
  return (
    <AccordionContent className={"h-40 border-t p-0 dark:border-zinc-700"}>
      {children}
    </AccordionContent>
  );
};

type TestAccordionTriggerProps = {
  testNumber: number;
  testResult?: PrismaJson.TestResultsType[number];
  hiddenTest: boolean;
};

const TestAccordionTrigger = ({
  testNumber,
  testResult,
  hiddenTest,
}: TestAccordionTriggerProps) => {
  const isPassed = testResult?.passed;
  const resultText = isPassed ? "Correct answer" : "Wrong answer";
  const resultIcon = isPassed ? <Check /> : <X />;
  const resultColor = isPassed ? "text-green-600" : "text-red-500";

  return (
    <div className="flex w-full items-center justify-between px-5 text-sm font-semibold">
      <div className={"flex items-center gap-3"}>
        <AccordionTrigger className="flex-row-reverse justify-end gap-3 font-semibold">
          {`Test ${testNumber + 1}`}
        </AccordionTrigger>
        {hiddenTest && <EyeOff className={"h-4 w-4 text-muted-foreground"} />}
      </div>
      {testResult && (
        <div
          className={cn(
            "flex cursor-default items-center gap-3 hover:no-underline",
            resultColor,
          )}
        >
          {resultIcon}
          {resultText}
        </div>
      )}
    </div>
  );
};

export {
  TestAccordion,
  TestAccordionItem,
  TestAccordionContent,
  TestAccordionTrigger,
};
