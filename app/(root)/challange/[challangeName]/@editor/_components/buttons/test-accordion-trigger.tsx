import { AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

type TestAccordionTriggerProps = {
  testNumber: number;
  testResult?: PrismaJson.TestResultsType[number];
};

const TestAccordionTrigger = ({
  testNumber,
  testResult,
}: TestAccordionTriggerProps) => {
  const isPassed = testResult?.passed;
  const resultText = isPassed ? "Correct answer" : "Wrong answer";
  const resultIcon = isPassed ? <Check /> : <X />;
  const resultColor = isPassed ? "text-green-600" : "text-red-500";

  return (
    <div className="flex w-full items-center justify-between px-5 text-sm font-semibold">
      <AccordionTrigger className="flex-row-reverse justify-end gap-3 font-semibold">
        {`Test ${testNumber + 1}`}
      </AccordionTrigger>
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

export default TestAccordionTrigger;
