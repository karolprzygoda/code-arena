"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ArrowRightLeft,
  Ellipsis,
  LucideIcon,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  SquareSlash,
} from "lucide-react";
import ToolbarButton from "@/app/(root)/(challenge)/_components/toolbar-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsDialog from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/settings-dialog";
import { useState } from "react";
import CodeResetDialog from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-reset-dialog";
import ShortcutsDialog from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/shortcuts-dialog";
import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import { useShallow } from "zustand/react/shallow";
import { useFullScreen } from "@/hooks/use-full-screen";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TToolbarButton = {
  id: string;
  tooltipMessage: string;
  tooltipSide: "top" | "left" | "right" | "bottom";
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

type EditorToolbarProps = {
  defaultCode: PrismaJson.DefaultCodeType;
};

const CodeEditorToolbar = ({ defaultCode }: EditorToolbarProps) => {
  const { fullScreenElement, setIsFullScreen, isFullScreen } =
    useUserPreferencesStore(
      useShallow((state) => ({
        fullScreenElement: state.fullScreenElement,
        setIsFullScreen: state.setIsFullScreen,
        isFullScreen: state.isFullScreen,
      })),
    );

  const { toggleFullScreen } = useFullScreen(
    fullScreenElement,
    setIsFullScreen,
  );

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [isOpen, setIsOpen] = useState({
    settingsDialog: false,
    codeResetDialog: false,
    shortcutsDialog: false,
  });

  const handleClose = (dialogName: keyof typeof isOpen) => {
    setIsOpen({ ...isOpen, [dialogName]: false });
  };

  const handleOpen = (dialogName: keyof typeof isOpen) => {
    setIsOpen({ ...isOpen, [dialogName]: true });
  };

  const handleSwitchLayout = () => {
    useUserPreferencesStore.getState().toggleLayout();
  };

  const handleMinMax = () => {
    toggleFullScreen();
  };

  const toolbarButtons: TToolbarButton[] = [
    {
      id: "reset-button",
      tooltipMessage: "Reset code to default",
      tooltipSide: "left",
      label: "Reset code to default",
      icon: RotateCcw,
      onClick: () => handleOpen("codeResetDialog"),
    },
    {
      id: "shortcuts-button",
      tooltipMessage: "Show shortcuts",
      tooltipSide: "top",
      label: "Show shortcuts",
      icon: SquareSlash,
      onClick: () => handleOpen("shortcutsDialog"),
    },
    {
      id: "settings-button",
      tooltipMessage: "Open settings",
      tooltipSide: "top",
      label: "Open settings",
      icon: Settings,
      onClick: () => handleOpen("settingsDialog"),
    },
    {
      id: "layout-button",
      tooltipMessage: "Swap panels",
      tooltipSide: "top",
      label: "Swap panels",
      icon: ArrowRightLeft,
      onClick: handleSwitchLayout,
    },
    {
      id: "minmax-button",
      tooltipMessage: isFullScreen ? "Minimize editor" : "Maximize editor",
      tooltipSide: "top",
      label: isFullScreen ? "Minimize editor" : "Maximize editor",
      icon: isFullScreen ? Minimize2 : Maximize2,
      onClick: handleMinMax,
    },
  ];

  return (
    <>
      {isDesktop ? (
        <DesktopToolbarList toolbarButtonsList={toolbarButtons} />
      ) : (
        <MobileToolbarList toolbarButtonsList={toolbarButtons} />
      )}
      <SettingsDialog
        isDesktop={isDesktop}
        isOpen={isOpen.settingsDialog}
        handleClose={() => handleClose("settingsDialog")}
      />
      <CodeResetDialog
        isDesktop={isDesktop}
        isOpen={isOpen.codeResetDialog}
        defaultCode={defaultCode}
        handleClose={() => handleClose("codeResetDialog")}
      />
      <ShortcutsDialog
        isDesktop={isDesktop}
        isOpen={isOpen.shortcutsDialog}
        handleClose={() => handleClose("shortcutsDialog")}
      />
    </>
  );
};

type ToolbarListProps = {
  toolbarButtonsList: TToolbarButton[];
};

const DesktopToolbarList = ({ toolbarButtonsList }: ToolbarListProps) => {
  return (
    <div className={"flex gap-4"}>
      {toolbarButtonsList.map((button) => (
        <ToolbarButton
          key={`editor-toolbar-${button.id}`}
          tooltipMessage={button.tooltipMessage}
          Icon={button.icon}
          tooltipSide={button.tooltipSide}
          onClick={button.onClick}
        />
      ))}
    </div>
  );
};

const MobileToolbarList = ({ toolbarButtonsList }: ToolbarListProps) => {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger
              aria-label={"Expand to see more actions"}
              className={
                "rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2"
              }
            >
              <Ellipsis className={"h-5 w-5 text-muted-foreground"} />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Expand to see more actions</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] flex flex-col gap-2 rounded-xl bg-background"
      >
        {toolbarButtonsList.map((button) => (
          <DropdownMenuItem asChild key={`editor-toolbar-${button.id}`}>
            <ToolbarButton
              tooltipMessage={button.tooltipMessage}
              label={button.label}
              Icon={button.icon}
              onClick={button.onClick}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CodeEditorToolbar;
