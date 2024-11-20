import { Swords } from "lucide-react";
import Link from "next/link";

type ChallangeGroupLink = {
  href: string;
  name: string;
};

const ChallangeGroupLink = ({ href, name }: ChallangeGroupLink) => {
  return (
    <Link
      href={href}
      className={
        "inline-flex h-9 flex-1 items-center justify-start gap-2 overflow-hidden rounded-md rounded-tl-xl px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-900"
      }
    >
      <Swords className={"h-4 w-4"} />
      <span className={"overflow-hidden text-ellipsis whitespace-nowrap"}>
        {name}
      </span>
    </Link>
  );
};

export default ChallangeGroupLink;
