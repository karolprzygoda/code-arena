import Link from "next/link";
import HeaderDropdown from "@/app/(root)/_components/header/header-dropdown";
import MobileNavSheet from "@/app/(root)/_components/header/mobile-nav-sheet";
import { SearchChallenge } from "@/app/(root)/_components/header/search-challenge";

const Header = () => {
  return (
    <header className={"w-full"}>
      <nav className={"flex h-14 items-center px-4 text-sm font-medium"}>
        <div className={"flex w-full items-center justify-between"}>
          <div className={"relative flex items-center gap-4 font-bold"}>
            <Link href={"/"}>code-arena.com</Link>
          </div>
          <div className={"flex items-center justify-end gap-2"}>
            <SearchChallenge />
            <HeaderDropdown />
            <MobileNavSheet />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
