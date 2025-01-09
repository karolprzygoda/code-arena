"use client";

import FilterButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/submissions/_components/filter-button";
import useSubmissionsContext from "@/hooks/use-submissions-context";
import { useShallow } from "zustand/react/shallow";

const FilterButtonsWrapper = () => {
  const { setStatus, setLanguage } = useSubmissionsContext(
    useShallow((state) => ({
      setStatus: state.setStatus,
      setLanguage: state.setLanguage,
    })),
  );

  return (
    <>
      <FilterButton
        setter={setStatus}
        values={["Status", "SUCCESS", "FAIL"]}
        defaultValue={"Status"}
        className={"ms-16 w-48"}
      />
      <FilterButton
        setter={setLanguage}
        values={["Language", "JAVASCRIPT", "JAVA", "PYTHON"]}
        defaultValue={"Language"}
        className={"w-44"}
      />
    </>
  );
};

export default FilterButtonsWrapper;
