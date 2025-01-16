import { Badge } from "@/components/ui/badge";
import { Language } from "@prisma/client";
import { cn } from "@/lib/utils";

type LanguageBadge = {
  language: Language;
  className?: string;
};

const colorMap = {
  JAVASCRIPT: "bg-yellow-400 hover:bg-yellow-500 text-zinc-700",
  PYTHON: "bg-blue-600 hover:bg-blue-600 text-zinc-50",
};

const LanguageBadge = ({ language, className }: LanguageBadge) => {
  return (
    <Badge className={cn("rounded-2xl", colorMap[language], className)}>
      {language}
    </Badge>
  );
};

export default LanguageBadge;
