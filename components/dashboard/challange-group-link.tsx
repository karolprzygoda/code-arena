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
        "inline-flex h-9 flex-1 items-center justify-start gap-2 whitespace-nowrap rounded-md rounded-tl-xl bg-transparent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-none transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-900 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      }
    >
      <Swords />
      <span className={"overflow-hidden text-ellipsis whitespace-nowrap"}>
        {name}
      </span>
    </Link>
  );
};

export default ChallangeGroupLink;
