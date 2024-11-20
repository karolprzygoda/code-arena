"use client";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useEffect, useState } from "react";

type DashBoardWrapper = {
  children: ReactNode;
};

const DashBoardWrapper = ({ children }: DashBoardWrapper) => {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 1024 ? "vertical" : "horizontal");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResizablePanelGroup
      direction={direction}
      className="flex flex-1 px-4 pb-4"
    >
      {children}
    </ResizablePanelGroup>
  );
};

export default DashBoardWrapper;
