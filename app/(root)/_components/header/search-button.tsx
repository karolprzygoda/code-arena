"use client";

import { Search } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

export const SearchButton = ({ ...props }: ButtonProps) => {
  return (
    <button
      aria-label={"search for challenge"}
      className={
        "rounded-lg p-2 focus:outline-none focus-visible:ring-2 lg:mr-2 lg:inline-flex lg:h-10 lg:w-64 lg:items-center lg:justify-between lg:gap-3 lg:rounded-md lg:border lg:border-input lg:px-4 lg:py-2 lg:text-sm lg:font-medium lg:text-muted-foreground lg:ring-offset-background lg:transition-colors lg:hover:bg-accent lg:hover:text-accent-foreground lg:focus-visible:outline-none lg:focus-visible:ring-2 lg:focus-visible:ring-ring lg:disabled:cursor-not-allowed lg:disabled:opacity-50"
      }
      {...props}
    >
      <Search className={"h-5 w-5"} />
      <span
        className={"hidden w-20 truncate text-left md:w-full lg:inline-block"}
      >
        Search Challenges...
      </span>
      <span className={"hidden whitespace-nowrap text-xs lg:inline-block"}>
        Ctrl K
      </span>
    </button>
  );
};
