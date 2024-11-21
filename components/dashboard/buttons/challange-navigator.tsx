import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChallangeNavigatorProps = {
  variant: "prev" | "next";
  href: string;
  tooltipMessage: string;
};

const ChallangeNavigator = ({
  variant,
  href,
  tooltipMessage,
}: ChallangeNavigatorProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={
              "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-accent-foreground shadow-none transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-900 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            }
          >
            {variant === "prev" ? (
              <ChevronLeft className={"h-4 w-4"} />
            ) : (
              <ChevronRight className={"h-4 w-4"} />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChallangeNavigator;
