"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

type CopyToClipBoardButtonProps = {
  data: string;
};

const CopyToClipBoardButton = ({ data }: CopyToClipBoardButtonProps) => {
  const [buttonText, setButtonText] = useState("Copy!");

  const handleCopyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      toast.success("URL has been copied to your clipboard");
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy!");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy URL. Please try again.");
    }
  };

  return (
    <Button className={"font-semibold"} onClick={handleCopyToClipBoard}>
      {buttonText}
      <Clipboard />
    </Button>
  );
};

export default CopyToClipBoardButton;
