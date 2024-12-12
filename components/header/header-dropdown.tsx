import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon, Palette, Settings2, User } from "lucide-react";
import Link from "next/link";
import ThemeButton from "@/components/theme/theme-button";
import SignOutButton from "@/components/header/sign-out-button";

const HeaderDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "hidden rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2 md:block"
        }
      >
        <User />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] w-56 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
      >
        <DropdownLink href={"#"} name={"Profile"} Icon={User} />
        <DropdownLink href={"#"} name={"Settings"} Icon={Settings2} />
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between rounded-lg px-2 py-0.5 text-sm">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </div>
          <ThemeButton />
        </div>
        <DropdownMenuSeparator />
        <SignOutButton className="w-full rounded-b-lg rounded-t-sm" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type DropdownLinkProps = {
  href: string;
  name: string;
  Icon: LucideIcon;
};

const DropdownLink = ({ href, name, Icon }: DropdownLinkProps) => {
  return (
    <Link href={href}>
      <DropdownMenuItem className="cursor-pointer rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none dark:hover:bg-neutral-700/50">
        <Icon className={"mr-2 h-4 w-4"} />
        {name}
      </DropdownMenuItem>
    </Link>
  );
};

export default HeaderDropdown;
