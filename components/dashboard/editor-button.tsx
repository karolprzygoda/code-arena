"use client";

import { LucideIcon } from "lucide-react";

type EditorButtonProps = {
  Icon: LucideIcon;
};

const EditorButton = ({ Icon }: EditorButtonProps) => {
  return (
    <button>
      <Icon
        className={"h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"}
      />
    </button>
  );
};

export default EditorButton;
