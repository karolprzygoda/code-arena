import { Bell } from "lucide-react";
import Link from "next/link";
import { SearchButton } from "@/components/header/search-button";
import HeaderDropdown from "@/components/header/header-dropdown";
import MobileNavSheet from "@/components/header/mobile-nav-sheet";

const Header = () => {
  return (
    <header className={"w-full"}>
      <nav className={"flex h-14 items-center px-4 text-sm font-medium"}>
        <div className={"flex w-full items-center justify-between"}>
          <div className={"relative flex items-center gap-4 font-bold"}>
            <Link href={"/"}>code-arena.com</Link>
          </div>
          <div className={"flex items-center justify-end gap-2"}>
            <SearchButton />
            <Link className={"ml-2"} href={"/"} title={"Notifications"}>
              <Bell className={"h-5 w-5"} />
            </Link>
            <HeaderDropdown />
            <MobileNavSheet />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
