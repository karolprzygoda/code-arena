"use client";

import MarkdownEditorToolbar from "@/app/(root)/create-challange/_components/markdown-editor-toolbar";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { useStore } from "zustand/index";
import {
  useMarkdownEditorKeyboardShortcuts,
  useMarkdownEditorStore,
} from "@/stores/markdown-editor-store";
import { useShallow } from "zustand/react/shallow";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const MarkdownBuilder = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { markdown, setMarkdown, setTextAreaElement } = useStore(
    useMarkdownEditorStore,
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
      setTextAreaElement: state.setTextAreaElement,
    })),
  );

  useMarkdownEditorKeyboardShortcuts();

  useEffect(() => {
    setTextAreaElement(textareaRef.current!);
  }, [setTextAreaElement]);

  return (
    <>
      <MarkdownEditorToolbar />
      <ContextMenu>
        <ContextMenuTrigger className={"h-full w-full"}>
          <Textarea
            ref={textareaRef}
            autoFocus
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={
              "h-full w-full resize-none rounded-xl border-0 p-4 focus-visible:ring-0 active:border-0"
            }
            placeholder="Write your Markdown here..."
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default MarkdownBuilder;
