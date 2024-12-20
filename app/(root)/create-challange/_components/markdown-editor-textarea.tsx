import { Textarea } from "@/components/ui/textarea";
import { ContextMenuTrigger } from "@/components/ui/context-menu";
import { ChangeEvent, RefObject } from "react";

type MarkdownEditorTextareaProps = {
  ref: RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

const MarkdownEditorTextarea = ({
  ref,
  value,
  onChange,
}: MarkdownEditorTextareaProps) => {
  return (
    <ContextMenuTrigger className={"h-full w-full"}>
      <Textarea
        ref={ref}
        autoFocus
        value={value}
        onChange={onChange}
        className={
          "h-full w-full resize-none rounded-xl border-0 p-4 focus-visible:ring-0 active:border-0"
        }
        placeholder="Write your Markdown here..."
      />
    </ContextMenuTrigger>
  );
};

export default MarkdownEditorTextarea;
