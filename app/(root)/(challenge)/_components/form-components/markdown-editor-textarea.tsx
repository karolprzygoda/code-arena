"use client";

import { Textarea } from "@/components/ui/textarea";
import { ContextMenuTrigger } from "@/components/ui/context-menu";
import { ChangeEvent, RefObject, useEffect } from "react";
import {
  useMarkdownEditorStore,
  useMarkdownTemporalStore,
} from "@/stores/markdown-editor-store";
import { useShallow } from "zustand/react/shallow";

type MarkdownEditorTextareaProps = {
  ref: RefObject<HTMLTextAreaElement>;
};

const MarkdownEditorTextarea = ({ ref }: MarkdownEditorTextareaProps) => {
  const { markdown, setMarkdown } = useMarkdownEditorStore(
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
    })),
  );

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const { undo, redo } = useMarkdownTemporalStore((state) => state);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        redo();
      } else if (
        event.ctrlKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [undo, redo]);

  return (
    <ContextMenuTrigger className={"h-full w-full"}>
      <Textarea
        ref={ref}
        autoFocus
        value={markdown}
        onChange={handleMarkdownChange}
        className={
          "h-full w-full resize-none rounded-xl border-0 p-4 focus-visible:ring-0 active:border-0"
        }
        placeholder="Write your Markdown here..."
      />
    </ContextMenuTrigger>
  );
};

export default MarkdownEditorTextarea;
