import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import CodeResetButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/code-reset-button";
import ShortcutButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/shortcut-button";
import SettingsButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/settings-button";
import SwitchLayoutButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/switch-layout-button";
import MaximizeEditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/maximize-editor-button";

type MobileEditorSettingsProps = {
  defaultCode: PrismaJson.DefaultCodeType;
};

const MobileEditorSettings = ({ defaultCode }: MobileEditorSettingsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2 sm:hidden"
        }
        title={"Open Settings"}
      >
        <Ellipsis className={"h-5 w-5 text-muted-foreground"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] flex flex-col gap-2 rounded-xl bg-background"
      >
        <DropdownMenuItem asChild>
          <CodeResetButton
            defaultCode={defaultCode}
            label={"Reset Your Code"}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ShortcutButton label={"Show shortcuts"} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SettingsButton label={"Settings"} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SwitchLayoutButton label={"Switch Layout"} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <MaximizeEditorButton label={"Enable Full Screen"} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileEditorSettings;
