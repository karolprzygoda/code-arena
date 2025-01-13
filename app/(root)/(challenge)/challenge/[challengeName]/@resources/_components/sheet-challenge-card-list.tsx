"use client";

import DifficultyBadge from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/difficulty-badge";
import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Challenge } from "@prisma/client";
import { useLayoutEffect } from "react";
import Link from "next/link";

type FilterActions = {
  challenges: Challenge[];
  setFilters: (filters: Partial<Record<keyof Challenge, unknown>>) => void;
};

const SheetChallengeCardList = () => {
  const { challenges, setFilters } = useFilteredDataContext<
    Challenge,
    FilterActions
  >(
    useShallow((state) => ({
      challenges: state.data,
      setFilters: state.setFilters,
    })),
  );

  useLayoutEffect(() => {
    setFilters({ difficulty: "BEGINNER" });
  }, [setFilters]);

  return (
    <ScrollArea>
      <div className={"flex flex-col gap-2 p-6 pt-0"}>
        {challenges.map((challenge, index) => (
          <Link
            className={"group/challenge"}
            key={`sheet-challenge-card-${index}`}
            href={`challenge/${challenge.title}`}
          >
            <div
              className={
                "dark:to-difficulty-easy-dark/20 flex w-full items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-neutral-500/10 from-70% to-difficulty-easy/20 to-100% p-4 text-black/90 duration-300 group-hover/challenge:scale-[1.025] group-hover/challenge:bg-neutral-500/20 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:from-neutral-900/70 dark:text-white/90 lg:rounded-lg lg:group-hover/challenge:rounded-xl"
              }
            >
              <div className={"text-sm font-semibold"}>{challenge.title}</div>
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SheetChallengeCardList;
