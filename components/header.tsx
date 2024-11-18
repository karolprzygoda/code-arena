import { Bell, Menu, Palette, Search, Settings2, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeButton from "@/components/theme-button";
import SignOutButton from "@/components/sign-out-button";

const Header = () => {
  return (
    <header className={"w-full"}>
      <nav className={"flex h-14 items-center px-4 text-sm font-medium"}>
        <div className={"flex w-full items-center justify-between"}>
          <div className={"relative flex items-center gap-4 font-bold"}>
            <Link className={"ps-2"} href={"/"}>
              code-arena.com
            </Link>
            <div className={"hidden items-center gap-4 md:flex"}>
              <Link
                className={
                  "text-foreground/80 transition-colors hover:text-foreground"
                }
                href={"/"}
              >
                Explore
              </Link>
              <Link
                className={
                  "text-foreground/80 transition-colors hover:text-foreground"
                }
                href={"/"}
              >
                Tracks
              </Link>
            </div>
          </div>
          <div className={"flex items-center justify-end gap-2"}>
            <button
              className={
                "rounded-lg p-2 focus:outline-none focus-visible:ring-2 lg:hidden"
              }
            >
              <Search className={"h-5 w-5"} />
            </button>
            <button
              className={
                "mr-2 hidden h-10 w-64 items-center justify-between gap-3 rounded-md border border-input px-4 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:inline-flex"
              }
            >
              <Search />
              <span
                className={
                  "hidden w-20 truncate text-left sm:inline-block md:w-full"
                }
              >
                Search Challenges...
              </span>
              <span className={"whitespace-nowrap text-xs"}>Ctrl K</span>
            </button>
            <Link className={"ml-2"} href={"/"}>
              <Bell className={"h-5 w-5"} />
            </Link>
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
                <Link className="block" href={`/`}>
                  <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none dark:hover:bg-neutral-700/50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link className="block" href={`/`}>
                  <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
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
            <div className={"md:hidden"}>
              <button className={"rounded-lg p-4 pr-0 focus:outline-none"}>
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
