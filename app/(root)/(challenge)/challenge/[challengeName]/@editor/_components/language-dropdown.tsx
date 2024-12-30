"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Icons } from "@/components/icons";
import { Language } from "@prisma/client";
import LanguageButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/language-button";
import useEditorContext from "@/hooks/use-editor-context";

const LanguageDropdown = () => {
  const { language } = useEditorContext(
    useShallow((state) => ({
      language: state.language,
    })),
  );

  const IconComponent = Icons[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={"mr-auto rounded-xl text-muted-foreground"}
          variant={"ghost"}
        >
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
        {Object.values(Language).map((lang) => (
          <DropdownMenuItem
            key={`dropdown-${lang}-button`}
            className={"!rounded-xl p-0"}
          >
            <LanguageButton
              language={lang.toLowerCase() as Lowercase<Language>}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
