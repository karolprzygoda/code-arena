import { cn, getStatusClass } from "@/lib/utils";
import UserProfileLink from "@/components/user-profile-link";
import { Challenge, Submission } from "@prisma/client";
import { User } from "@supabase/supabase-js";

type SubmissionMetadataProps = {
  submission: Submission & { challenge: Challenge };
  user: (User & { isAdmin: boolean }) | null;
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
    <div className={"w-full"}>
      <div className={"flex flex-col"}>
        <div className={"flex items-center gap-2"}>
          <div className={cn(getStatusClass(submission.status))}>
            {submission.status}
          </div>
          <div className={"text-xs text-muted-foreground"}>
            {getNumberOfPassedTests(submission) + " Test cases passed"}
          </div>
        </div>
        <div className={"flex flex-wrap items-center"}>
          <UserProfileLink user={user} />
          <span className={"text-xs text-muted-foreground"}>
            submitted at {formattedDate} {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionMetadata;
