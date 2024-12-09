import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeButton from "@/components/theme/theme-button";
import SignOutButton from "@/components/header/sign-out-button";
import HeaderLink from "@/components/header/header-link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileNavButton = () => {
  return (
    <Sheet>
      <SheetTrigger
        className={"rounded-lg p-4 pr-0 focus:outline-none md:hidden"}
        title={"open menu button"}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent className={"w-full md:w-1/3"} side={"left"}>
        <SheetHeader className={"mt-8"}>
          <SheetTitle>Menu</SheetTitle>
          <VisuallyHidden>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className={"flex flex-col"}>
          <div className={"flex flex-col gap-4 border-b py-4"}>
            <HeaderLink href={"/"}>Explore</HeaderLink>
            <HeaderLink href={"/"}>Tracks</HeaderLink>
            <HeaderLink href={"/"}>Profile</HeaderLink>
          </div>
          <div className={"flex flex-col gap-4 pt-4"}>
            <div className={"flex items-center gap-4"}>
              <span className={"text-foreground/80"}>Theme</span>
              <ThemeButton />
            </div>
            <SignOutButton className={"ps-0"} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavButton;
