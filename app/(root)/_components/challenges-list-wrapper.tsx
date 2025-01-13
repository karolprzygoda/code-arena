"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ChallengesListWrapperProps = {
  children: ReactNode;
};

const ChallengesListWrapper = ({ children }: ChallengesListWrapperProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollAmount = 400;

  const updateButtonVisibility = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;

    if (viewport) {
      const { scrollLeft, scrollWidth, clientWidth } = viewport;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  const handleScrollLeft = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;
    if (viewport) {
      viewport.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;
    if (viewport) {
      viewport.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;

    if (viewport) {
      updateButtonVisibility();
      viewport.addEventListener("scroll", updateButtonVisibility);
      return () => {
        viewport.removeEventListener("scroll", updateButtonVisibility);
      };
    }
  }, []);

  return (
    <ScrollArea
      className={"home-cards-container relative w-full"}
      ref={scrollAreaRef}
    >
      <div
        className={
          "carousel flex w-full snap-x flex-nowrap gap-4 p-6 px-4 md:px-24"
        }
      >
        {children}
      </div>
      <ScrollBar orientation={"horizontal"} hidden className={"hidden"} />
      <button
        onClick={handleScrollLeft}
        className={cn(
          "absolute left-40 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 focus:outline-none focus-visible:ring-2 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50 xl:block",
          isAtStart && "!hidden",
        )}
        aria-label="Slide carousel of challenges to the left"
      >
        <ChevronLeft className="h-4 w-4 stroke-[3]" />
      </button>
      <button
        onClick={handleScrollRight}
        className={cn(
          "absolute right-40 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 focus:outline-none focus-visible:ring-2 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50 xl:block",
          isAtEnd && "!hidden",
        )}
        aria-label="Slide carousel of challenges to the right"
      >
        <ChevronRight className="h-4 w-4 stroke-[3]" />
      </button>
    </ScrollArea>
  );
};

export default ChallengesListWrapper;
