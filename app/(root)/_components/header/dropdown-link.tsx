import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

type DropdownLinkProps = {
  href: string;
  name: string;
  Icon: LucideIcon;
};

const DropdownLink = ({ href, name, Icon }: DropdownLinkProps) => {
  return (
    <Link href={href}>
      <DropdownMenuItem className="cursor-pointer rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none dark:hover:bg-neutral-700/50">
        <Icon className={"h-4 w-4"} />
        {name}
      </DropdownMenuItem>
    </Link>
  );
};

export default DropdownLink;
