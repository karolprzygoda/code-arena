"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const ResourcesErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center gap-4 text-center"
      }
    >
      <h2 className={"text-3xl"}>Something went wrong!</h2>
      <Button className={"font-semibold"} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
};

export default ResourcesErrorPage;
