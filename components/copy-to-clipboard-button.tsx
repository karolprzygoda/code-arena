import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

type CopyToClipBoardButtonProps = {
  data: string;
};

const CopyToClipBoardButton = ({ data }: CopyToClipBoardButtonProps) => {
  const [buttonText, setButtonText] = useState("Copy!");

  const handleCopyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: "URL Copied!",
        description: "URL has been copied to your clipboard",
      });
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy!");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast({
        title: "Copy Failed!",
        description: "Unable to copy URL. Please try again.",
      });
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
