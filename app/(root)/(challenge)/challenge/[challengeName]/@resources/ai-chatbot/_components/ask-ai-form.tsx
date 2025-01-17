"use client";

import { AutoGrowingTextarea } from "@/components/auto-growing-textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { ChangeEventHandler, FormEventHandler } from "react";

type AskAiFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

const AskAiForm = ({ onSubmit, value, onChange }: AskAiFormProps) => {
  return (
    <form onSubmit={onSubmit} className={"flex w-full justify-center px-4"}>
      <div
        className={
          "shadow-alpha-400 relative z-10 w-full max-w-[800px] rounded-xl border border-zinc-300 shadow focus-within:ring-1 focus-within:ring-ring dark:border-transparent dark:bg-[#1e1e1e]"
        }
      >
        <AutoGrowingTextarea
          value={value}
          maxHeight={200}
          onChange={onChange}
          className={
            "scrollbar-thin h-fit w-full resize-none rounded-xl border-0 bg-transparent p-3 pb-1.5 text-sm shadow-none outline-none !ring-0"
          }
          placeholder={"Write your message here..."}
        />
        <div className={"flex items-center justify-end gap-2 p-3"}>
          <Button
            disabled={value === ""}
            type={"submit"}
            aria-label={"Send message to the chatbot"}
            className={"h-fit rounded-full p-2"}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AskAiForm;
