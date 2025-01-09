import {
  cn,
  getMaxExecutionTime,
  getMaxMemoryUsage,
  getStatusClass,
} from "@/lib/utils";
import { Calendar, Clock, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@prisma/client";
import Link from "next/link";

type SubmissionRowProps = {
  submission: Submission;
  index: number;
  challengeName: string;
};

const SubmissionRow = ({
  submission,
  index,
  challengeName,
}: SubmissionRowProps) => {
  return (
    <li>
      <Link
        href={`/challenge/${challengeName}/submissions/${submission.id}`}
        className={
          "flex items-center py-2 font-medium transition hover:bg-muted dark:hover:bg-zinc-700/50"
        }
      >
        <div className={"w-16 shrink-0 text-center"}>{index + 1}</div>
        <div className={"flex w-48 shrink-0 flex-col gap-1"}>
          <span className={cn(getStatusClass(submission.status))}>
            {submission.status}
          </span>
          <span className={"flex items-center gap-1 text-xs"}>
            <Calendar className={"h-3.5 w-3.5"} />
            {submission.createdAt.toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <div className={"w-44 shrink-0"}>
          <Badge
            className={
              "rounded-2xl bg-muted text-muted-foreground dark:bg-neutral-700 dark:text-white"
            }
          >
            {submission.language}
          </Badge>
        </div>
        <div className={"flex w-44 shrink-0 items-center gap-2"}>
          <Clock className={"h-4 w-4"} />
          {getMaxExecutionTime(submission.testResults)}
        </div>
        <div className={"flex w-44 shrink-0 items-center gap-2"}>
          <Cpu className={"h-4 w-4"} />
          {getMaxMemoryUsage(submission.testResults)}
        </div>
      </Link>
    </li>
  );
};

export default SubmissionRow;
