import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon, Palette, SquarePen, User } from "lucide-react";
import ThemeButton from "@/components/theme/theme-button";
import SignOutButton from "@/components/header/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { jwtDecode } from "jwt-decode";
import { JWTWithUserRole } from "@/lib/types";
import Link from "next/link";
import { getUserProfilePicture } from "@/lib/utils";
import Image from "next/image";

const HeaderDropdown = async () => {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = null;

  if (session) {
    const jwt: JWTWithUserRole = jwtDecode(session.access_token);

    userRole = jwt.user_role;
  }

  const userProfileImage = getUserProfilePicture(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "hidden items-center justify-center rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2 md:flex"
        }
      >
        {userProfileImage ? (
          <div className={"relative h-7 w-7 rounded-full"}>
            <Image
              className={"aspect-square rounded-full"}
              src={userProfileImage}
              alt={"user profile image"}
              fill
            />
          </div>
        ) : (
          <User />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] w-56 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
      >
        {userRole === "ADMIN" && (
          <>
            <DropdownLink
              href={"/create-challenge"}
              name={"Create Challenge"}
              Icon={SquarePen}
            />
            <DropdownMenuSeparator />
          </>
        )}
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
        <Icon className={"h-4 w-4"} />
        {name}
      </DropdownMenuItem>
    </Link>
  );
};

export default HeaderDropdown;
