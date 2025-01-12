"use client";

import { ContextMenuTrigger } from "@/components/ui/context-menu";
import { MutableRefObject, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useMarkdownContext from "@/hooks/use-markdown-context";
import { useMarkdownTemporalStore } from "@/hooks/use-markdown-temporal-store";
import { Editor, OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { editor } from "monaco-editor";

type MarkdownEditorTextareaProps = {
  ref: MutableRefObject<editor.IStandaloneCodeEditor | null>;
};

const MarkdownEditorTextarea = ({ ref }: MarkdownEditorTextareaProps) => {
  const { markdown, setMarkdown } = useMarkdownContext(
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
    })),
  );

  const { resolvedTheme } = useTheme();

  const handleEditorDidMount: OnMount = (editor) => {
    if (ref) {
      ref.current = editor;
    }
    editor.focus();
  };

  const handleMarkdownChange = (text: string) => {
    setMarkdown(text);
  };

  const { undo, redo } = useMarkdownTemporalStore().temporal.getState();

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
      <Editor
        value={markdown}
        onChange={(e) => handleMarkdownChange(e as string)}
        onMount={handleEditorDidMount}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontLigatures: true,
          wordWrap: "on",
          bracketPairColorization: {
            enabled: true,
          },
          formatOnPaste: true,
        }}
        language={"markdown"}
      />
    </ContextMenuTrigger>
  );
};

export default MarkdownEditorTextarea;
