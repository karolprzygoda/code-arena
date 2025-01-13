import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";

const COLORS_BY_DIFFICULTY_TAG = {
  BEGINNER: "dark:bg-sky-300 bg-sky-600/50",
  EASY: "dark:bg-green-300 bg-green-600/50",
  MEDIUM: "dark:bg-yellow-300 bg-yellow-600/50",
  HARD: "dark:bg-red-300 bg-red-600/50",
  EXTREME: "dark:bg-purple-300 bg-purple-600/50",
} as const;

type DifficultyTagShadowProps = {
  difficultyTag: Difficulty;
};

const DifficultyTagShadow = ({ difficultyTag }: DifficultyTagShadowProps) => {
  return (
    <div
      className={cn(
        "absolute -left-8 -z-10 h-12 w-32 rounded-full blur-3xl",
        COLORS_BY_DIFFICULTY_TAG[difficultyTag],
      )}
    ></div>
  );
};

export default DifficultyTagShadow;
