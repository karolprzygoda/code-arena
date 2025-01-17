"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchButton } from "@/app/(root)/_components/header/search-button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Challenge, Difficulty } from "@prisma/client";
import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import { fromKebabCaseToPascalCase } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SearchChallengeProps = {
  challenges: Array<Pick<Challenge, "id" | "title" | "difficulty">>;
};

export function SearchChallenge({ challenges }: SearchChallengeProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Search challenge</DialogTitle>
          <DialogDescription>
            Place where user can search for particular Challenge.
          </DialogDescription>
        </VisuallyHidden>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList onSelect={console.log}>
          {Object.values(Difficulty).map((difficulty) => (
            <CommandGroup
              value={difficulty}
              key={difficulty}
              heading={difficulty}
            >
              {challenges
                .filter((challenge) => challenge.difficulty === difficulty)
                .map((challengeWithTag) => (
                  <CommandItem
                    key={`${challengeWithTag.id}-${difficulty}`}
                    className={"flex cursor-pointer gap-2"}
                    value={`${challengeWithTag.difficulty}_${challengeWithTag.title}`}
                    onSelect={(value) => {
                      router.push(`/challenge/${value.split("_")[1]}`);
                      setOpen(false);
                    }}
                  >
                    <DifficultyBadge difficulty={challengeWithTag.difficulty} />
                    {fromKebabCaseToPascalCase(challengeWithTag.title)}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
}
