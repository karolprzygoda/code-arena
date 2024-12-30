import { Swords } from "lucide-react";
import Link from "next/link";

type ChallengeGroupLinkProps = {
  href: string;
  name: string;
};

const ChallengeGroupLink = ({ href, name }: ChallengeGroupLinkProps) => {
  return (
    <Link
      href={href}
      className={
        "inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md rounded-tl-xl p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 @[70px]/panel:h-9 @[70px]/panel:justify-start @[70px]/panel:px-3 dark:hover:bg-zinc-900"
      }
    >
      <Swords className={"h-4 w-4 shrink-0"} />
      <span
        className={
          "hidden overflow-hidden text-ellipsis whitespace-nowrap @[70px]/panel:inline"
        }
      >
        {name}
      </span>
    </Link>
  );
};

export default ChallengeGroupLink;
