import { cn, STATUS_STYLE } from "@/lib/utils";
import { Challenge, Submission } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { TUserRoles } from "@/lib/types";
import UserProfileLink from "@/components/user-profile-link";

type SubmissionMetadataProps = {
  submission: Submission & { challenge: Challenge };
  user: TUserRoles;
};

const getNumberOfPassedTests = (
  submission: Submission & { challenge: Challenge },
) => {
  return (
    (submission.testResults?.filter((test) => test.passed).length ?? 0) +
    " / " +
    submission.challenge.testCases.length
  );
};

const SubmissionMetadata = ({ submission, user }: SubmissionMetadataProps) => {
  const formattedDate = submission.createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const formattedTime = submission.createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className={"flex w-full flex-wrap justify-between gap-2"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex items-center gap-2"}>
          <div className={cn(STATUS_STYLE[submission.status])}>
            {submission.status}
          </div>
          <div className={"text-xs text-muted-foreground"}>
            {getNumberOfPassedTests(submission) + " Test cases passed"}
          </div>
        </div>
        <div className={"flex flex-wrap items-center gap-4"}>
          <UserProfileLink user={user} />
          <span className={"text-xs text-muted-foreground"}>
            submitted at {formattedDate} {formattedTime}
          </span>
        </div>
      </div>
      <Button
        className={
          "rounded-xl bg-green-600 font-semibold text-white hover:bg-green-700"
        }
        size={"sm"}
        asChild
      >
        {submission.status === "SUCCESS" && (
          <Link href={`/create-solution/${submission.id}`}>
            <SquarePen />
            Solution
          </Link>
        )}
      </Button>
    </div>
  );
};

export default SubmissionMetadata;
