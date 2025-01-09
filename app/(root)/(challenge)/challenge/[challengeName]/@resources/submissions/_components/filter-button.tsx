"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Language, Status } from "@prisma/client";

type StatusFilterButtonProps = {
  setter:
    | ((state: Language | "LANGUAGE") => void)
    | ((state: Status | "STATUS") => void);
  values: string[];
  defaultValue: string;
  className?: string;
};

const FilterButton = ({
  setter,
  values,
  defaultValue,
  className,
}: StatusFilterButtonProps) => {
  return (
    <Select onValueChange={setter}>
      <div className={cn(className)}>
        <SelectTrigger className="h-fit w-fit shrink-0 gap-4 border-0 p-0 shadow-none outline-0 ring-0 focus:ring-0">
          <SelectValue placeholder={defaultValue} defaultValue={defaultValue} />
        </SelectTrigger>
      </div>
      <SelectContent>
        {values.map((value) => (
          <SelectItem
            key={`select-${value.toUpperCase()}`}
            className={"cursor-pointer"}
            value={value.toUpperCase()}
          >
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterButton;
