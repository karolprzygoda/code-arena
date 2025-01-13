import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Difficulty } from "@prisma/client";

const difficultyColorMap = {
  BEGINNER: "bg-difficulty-beginner",
  EASY: "bg-difficulty-easy",
  MEDIUM: "bg-difficulty-medium",
  HARD: "bg-difficulty-hard",
  EXTREME: "bg-difficulty-extreme",
};

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  return (
    <Badge
      className={cn(
        "rounded-2xl",
        difficultyColorMap[difficulty],
        `hover:${difficultyColorMap[difficulty]}`,
      )}
    >
      {difficulty}
    </Badge>
  );
};

export default DifficultyBadge;
