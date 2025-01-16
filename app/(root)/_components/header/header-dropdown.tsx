import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import ThemeButton from "@/components/theme/theme-button";
import SignOutButton from "@/app/(root)/_components/header/sign-out-button";
import HeaderDropdownTrigger from "@/app/(root)/_components/header/header-dropdown-trigger";
import AdminDropDownContent from "@/app/(root)/_components/header/admin-dropdown-content";

const HeaderDropdown = async () => {
  return (
    <DropdownMenu>
      <HeaderDropdownTrigger />
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] w-56 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
      >
        <AdminDropDownContent />
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

export default HeaderDropdown;
