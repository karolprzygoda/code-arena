"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { AvailableLanguages } from "@/lib/types";
import { Icons } from "@/components/icons";
import { useStore } from "zustand";

const ChooseLanguageButton = () => {
  const { language } = useStore(
    useEditorStore,
    useShallow((state) => ({
      language: state.language,
    })),
  );

  const IconComponent =
    Icons[language.toLocaleLowerCase() as keyof typeof Icons];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={"mr-auto text-muted-foreground"} variant={"ghost"}>
          <IconComponent className={"h-6 w-6"} />
          {language}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={"bottom"}
        align={"start"}
        className={
          "rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
        }
      >
        <DropdownButton language={"JavaScript"} />
        <DropdownButton language={"Java"} />
        <DropdownButton language={"Python"} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type DropdownButtonProps = {
  language: AvailableLanguages;
};

const DropdownButton = ({ language }: DropdownButtonProps) => {
  const { setLanguage } = useStore(
    useEditorStore,
    useShallow((state) => ({
      setLanguage: state.setLanguage,
    })),
  );

  const IconComponent =
    Icons[language.toLocaleLowerCase() as keyof typeof Icons];

  return (
    <DropdownMenuItem className={"p-0"}>
      <Button
        className={"h-auto w-full items-center justify-start gap-4"}
        variant={"ghost"}
        onClick={() => setLanguage(language)}
      >
        <IconComponent className={"h-6 w-6"} />
        {language}
      </Button>
    </DropdownMenuItem>
  );
};

export default ChooseLanguageButton;
