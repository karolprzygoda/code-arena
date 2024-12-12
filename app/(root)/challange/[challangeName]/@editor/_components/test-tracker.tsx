import { CircleCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type TestTrackerProps = {
  testsPassed: number;
  testsNumber: number;
};

const TestTracker = ({ testsPassed, testsNumber }: TestTrackerProps) => {
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-1 font-bold",
        testsPassed === testsNumber ? "text-green-600" : "text-red-500",
      )}
    >
      {testsPassed === testsNumber ? <CircleCheck /> : <TriangleAlert />}
      Tests passed: {testsPassed}/{testsNumber}
    </div>
  );
};

export default TestTracker;
