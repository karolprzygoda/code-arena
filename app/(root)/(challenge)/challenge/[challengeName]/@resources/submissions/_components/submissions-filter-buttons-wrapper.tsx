"use client";

import FilterButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/filter-button";
import { useShallow } from "zustand/react/shallow";
import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Submission } from "@prisma/client";

type FilterActions = {
  setFilters: (filters: Partial<Record<keyof Submission, unknown>>) => void;
};

const SubmissionsFilterButtonsWrapper = () => {
  const { setFilters } = useFilteredDataContext<Submission, FilterActions>(
    useShallow((state) => ({
      setFilters: state.setFilters,
    })),
  );

  return (
    <>
      <FilterButton
        setter={(value) => setFilters({ status: value })}
        selectItems={[
          { label: "Status", value: "STATUS" },
          { label: "SUCCESS", value: "SUCCESS" },
          { label: "FAIL", value: "FAIL" },
        ]}
        className={"ms-16 w-48"}
      />
      <FilterButton
        setter={(value) => setFilters({ language: value })}
        selectItems={[
          { label: "Language", value: "LANGUAGE" },
          { label: "JavaScript", value: "JAVASCRIPT" },
          { label: "Python", value: "PYTHON" },
        ]}
        className={"w-44"}
      />
    </>
  );
};

export default SubmissionsFilterButtonsWrapper;
