import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import UserChallengesResults from "@/app/(root)/_components/user-challenges-results";
import DifficultyTagShadow from "@/app/(root)/_components/difficulty-tag-shadow";

type ChallengesListTitleProps = {
  difficultyTag: Difficulty;
};

const TITLES_BY_DIFFICULTY_TAG = {
  BEGINNER: {
    styles:
      "bg-clip-text text-transparent select-none bg-gradient-to-r from-sky-500 to-sky-500 dark:from-sky-500 dark:to-sky-200",
    title: "Great for Beginners",
  },
  EASY: {
    styles:
      "bg-clip-text text-transparent select-none bg-gradient-to-r from-green-600 to-green-500 dark:from-green-300 dark:to-green-100",
    title: "Great for Learners",
  },
  MEDIUM: {
    styles:
      "bg-clip-text text-transparent select-none bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-100",
    title: "Great for Enthusiasts",
  },
  HARD: {
    styles:
      "bg-clip-text text-transparent select-none bg-gradient-to-r from-red-600 to-red-500 dark:from-red-300 dark:to-red-100",
    title: "Great for Experts",
  },
  EXTREME: {
    styles:
      "bg-clip-text text-transparent select-none bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-100",
    title: "Great for Masters",
  },
} as const;

const ChallengesListTitle = ({ difficultyTag }: ChallengesListTitleProps) => {
  return (
    <div
      className={"flex flex-col items-start gap-3 sm:flex-row sm:items-center"}
    >
      <h2
        className={cn(
          "relative text-3xl font-bold tracking-tight",
          TITLES_BY_DIFFICULTY_TAG[difficultyTag].styles,
        )}
      >
        <DifficultyTagShadow difficultyTag={difficultyTag} />
        {TITLES_BY_DIFFICULTY_TAG[difficultyTag].title}
      </h2>
      <div className={"flex items-center gap-1"}>
        <UserChallengesResults difficultyTag={difficultyTag} />
      </div>
    </div>
  );
};

export default ChallengesListTitle;
