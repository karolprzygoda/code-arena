"use client";

import FilterButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/filter-button";
import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Solution } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";

type FilterActions = {
  setFilters: (filters: Partial<Record<keyof Solution, unknown>>) => void;
  setSort: (key: keyof Solution, order: "asc" | "desc") => void;
};

const SolutionFilterButtonsWrapper = () => {
  const { setFilters, setSort } = useFilteredDataContext<
    Solution,
    FilterActions
  >(
    useShallow((state) => ({
      setFilters: state.setFilters,
      setSort: state.setSort,
    })),
  );

  return (
    <div
      className={
        "flex w-full flex-wrap gap-4 border-b border-zinc-300 px-4 py-2 dark:border-zinc-700"
      }
    >
      <FilterButton
        setter={(value) => setFilters({ language: value })}
        selectItems={[
          { label: "Language", value: "LANGUAGE" },
          { label: "JavaScript", value: "JAVASCRIPT" },
          { label: "Python", value: "PYTHON" },
        ]}
      />
      <FilterButton
        setter={(value) => {
          const [key, order] = value.split(":");
          setSort(key as keyof Solution, order as "asc" | "desc");
        }}
        selectItems={[
          { label: "Newest Solutions", value: "createdAt:desc" },
          { label: "Oldest Solutions", value: "createdAt:asc" },
          { label: "Most UpVotes", value: "upVotes:desc" },
          { label: "Least UpVotes", value: "upVotes:asc" },
          { label: "Most DownVotes", value: "downVotes:desc" },
          { label: "Least DownVotes", value: "downVotes:asc" },
        ]}
      />
    </div>
  );
};

export default SolutionFilterButtonsWrapper;
