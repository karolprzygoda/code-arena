import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type SubmissionHeaderProps = {
  challengeName: string;
};

const SubmissionHeader = ({ challengeName }: SubmissionHeaderProps) => {
  return (
    <div
      className={
        "flex w-full border-b border-zinc-300 px-4 py-2 text-sm font-semibold text-muted-foreground dark:border-zinc-700"
      }
    >
      <Link
        href={`/challenge/${challengeName}/submissions`}
        className={
          "flex items-center gap-1 hover:text-black dark:hover:text-white"
        }
      >
        <ArrowLeft className={"h-4 w-4"} />
        All Submissions
      </Link>
    </div>
  );
};

export default SubmissionHeader;
