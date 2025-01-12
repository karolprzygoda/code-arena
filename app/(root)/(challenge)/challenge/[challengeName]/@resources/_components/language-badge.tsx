import { Badge } from "@/components/ui/badge";
import { Language } from "@prisma/client";
import { cn } from "@/lib/utils";

type LanguageBadge = {
  language: Language;
  className?: string;
};

const colorMap = {
  JAVASCRIPT: "bg-yellow-500/80 hover:bg-yellow-500/80 text-zinc-100",
  PYTHON: "bg-blue-500 hover:bg-blue-500 text-zinc-100",
};

const LanguageBadge = ({ language, className }: LanguageBadge) => {
  return (
    <Badge className={cn("rounded-2xl", colorMap[language], className)}>
      {language}
    </Badge>
  );
};

export default LanguageBadge;
