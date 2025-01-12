"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type StatusFilterButtonProps = {
  setter: (value: string) => void;
  selectItems: [
    { label: string; value: string },
    ...{ label: string; value: string }[],
  ];
  className?: string;
};

const FilterButton = ({
  setter,
  selectItems,
  className,
}: StatusFilterButtonProps) => {
  return (
    <Select onValueChange={setter}>
      <div className={cn(className)}>
        <SelectTrigger className="h-fit w-fit shrink-0 gap-4 border-0 p-0 shadow-none outline-0 ring-0 focus:ring-0">
          <SelectValue
            placeholder={selectItems[0].label}
            defaultValue={selectItems[0].value}
          />
        </SelectTrigger>
      </div>
      <SelectContent>
        {selectItems.map((item) => (
          <SelectItem
            key={`select-${item.value}`}
            className={"cursor-pointer"}
            value={item.value}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterButton;
