import Link from "next/link";
import { cn, fromKebabCaseToPascalCase } from "@/lib/utils";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import { Difficulty } from "@prisma/client";
import { Check } from "lucide-react";

const COLOR_BY_TAG = {
  BEGINNER: "!to-[hsl(var(--difficulty-beginner))]/20",
  EASY: "!to-[hsl(var(--difficulty-easy))]/20",
  MEDIUM: "!to-[hsl(var(--difficulty-medium))]/20",
  HARD: "!to-[hsl(var(--difficulty-hard))]/20",
  EXTREME: "!to-[hsl(var(--difficulty-extreme))]/20",
} as const;

type SheetChallengeCardProps = {
  title: string;
  difficulty: Difficulty;
  isPassed: boolean;
};

const SheetChallengeCard = ({
  title,
  difficulty,
  isPassed,
}: SheetChallengeCardProps) => {
  const formatedTitle = fromKebabCaseToPascalCase(title);

  return (
    <Link className={"group/challenge"} href={`/challenge/${title}`}>
      <div
        className={cn(
          "dark:to-difficulty-easy-dark/20 flex w-full items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-neutral-500/10 from-70% to-100% p-4 text-black/90 duration-300 group-hover/challenge:scale-[1.025] group-hover/challenge:bg-neutral-500/20 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:from-neutral-900/70 dark:text-white/90 lg:rounded-lg lg:group-hover/challenge:rounded-xl",
          COLOR_BY_TAG[difficulty],
        )}
      >
        <div className={"flex items-center justify-start gap-4"}>
          {isPassed ? (
            <div
              className={
                "flex h-5 w-5 items-center justify-center rounded-full border border-black/70 bg-emerald-500 dark:border-white/50"
              }
            >
              <Check className={"h-4 w-4 text-black"} />
            </div>
          ) : (
            <div
              className={
                "h-5 w-5 rounded-full border border-black/70 bg-black/10 dark:border-white/50 dark:bg-white/10"
              }
            ></div>
          )}
          <div className={"text-sm"}>{formatedTitle}</div>
        </div>

        <DifficultyBadge difficulty={difficulty} />
      </div>
    </Link>
  );
};

export default SheetChallengeCard;
