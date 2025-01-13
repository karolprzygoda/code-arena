import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFilteredDataContext from "@/hooks/use-filtered-data-context";
import { Challenge } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";

type FilterActions = {
  setFilters: (filters: Partial<Record<keyof Challenge, unknown>>) => void;
};

const FilterChallengesButton = () => {
  const { setFilters } = useFilteredDataContext<Challenge, FilterActions>(
    useShallow((state) => ({
      setFilters: state.setFilters,
    })),
  );

  return (
    <Select onValueChange={(value) => setFilters({ difficulty: value })}>
      <SelectTrigger className={"w-1/2"}>
        <SelectValue placeholder={"BEGINNER"} defaultValue={"BEGINNER"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className={"cursor-pointer"} value={"BEGINNER"}>
          BEGINNER
        </SelectItem>
        <SelectItem className={"cursor-pointer"} value={"EASY"}>
          EASY
        </SelectItem>
        <SelectItem className={"cursor-pointer"} value={"MEDIUM"}>
          MEDIUM
        </SelectItem>
        <SelectItem className={"cursor-pointer"} value={"HARD"}>
          HARD
        </SelectItem>
        <SelectItem className={"cursor-pointer"} value={"EXTREME"}>
          EXTREME
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterChallengesButton;
