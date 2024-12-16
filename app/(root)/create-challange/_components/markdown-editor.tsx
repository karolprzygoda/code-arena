"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import useDirection from "@/hooks/use-direction";
import { Textarea } from "@/components/ui/textarea";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import {
  Bold,
  Code,
  FileImage,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  MessageSquareQuote,
  Strikethrough,
  Table,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUndo } from "@/hooks/use-undo";
import { useTheme } from "next-themes";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const { resolvedTheme } = useTheme();

  const direction = useDirection();
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const { addToHistory } = useUndo(setMarkdown);

  const typographyVariants = {
    bold: "****",
    italic: "**",
    strike: "~~~~",
    inlineCode: "``",
    codeBlock: "```\n\n```",
    quote: "> ",
    unorderedList: "- ",
    orderedList: "1. ",
    h1: "# ",
    h2: "## ",
    h3: "### ",
  };

  const handleMarkdownUpdate = (newText: string) => {
    setMarkdown(newText);
    addToHistory(newText);
  };

  const handleSetTypography = (
    typographyVariant: Readonly<keyof typeof typographyVariants>,
    isBlockVariant = false,
  ) => {
    const typography = typographyVariants[typographyVariant];
    const textareaElement = textarea.current!;

    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;

    const beforeText = markdown.slice(0, start);
    const selectedText = markdown.slice(start, end);
    const afterText = markdown.slice(end);

    if (isBlockVariant) {
      // Block-level formatting (e.g., code blocks, quotes, headers)
      const lines = selectedText.split("\n");
      const formattedLines = lines.map((line) => typography + line);
      const newText = beforeText + formattedLines.join("\n") + afterText;
      handleMarkdownUpdate(newText);

      setTimeout(() => {
        textareaElement.setSelectionRange(start, start + newText.length);
        textareaElement.focus();
      }, 0);
    } else {
      // Inline formatting (e.g., bold, italic, inline code)
      if (start !== end) {
        const typographyVariantText =
          typography.slice(0, typography.length / 2) +
          selectedText +
          typography.slice(typography.length / 2);

        const newText = beforeText + typographyVariantText + afterText;
        handleMarkdownUpdate(newText);

        setTimeout(() => {
          const cursorPosition =
            start +
            typography.length / 2 +
            selectedText.length +
            typography.length / 2;
          textareaElement.setSelectionRange(cursorPosition, cursorPosition);
          textareaElement.focus();
        }, 0);
      } else {
        const newText = beforeText + typography + afterText;
        handleMarkdownUpdate(newText);

        setTimeout(() => {
          const cursorPosition = start + typography.length / 2;
          textareaElement.setSelectionRange(cursorPosition, cursorPosition);
          textareaElement.focus();
        }, 0);
      }
    }
  };

  return (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel minSize={30} defaultSize={50}>
        <PanelWrapper
          className={"overflow-hidden rounded-xl dark:bg-[#1e1e1e]"}
        >
          <PanelHeader className={"gap-4 px-4"}>
            <EditorButton
              onClick={() => handleSetTypography("bold")}
              iconWidth={2}
              Icon={Bold}
              tooltipMessage={"Bold"}
            />
            <EditorButton
              onClick={() => handleSetTypography("italic")}
              iconWidth={2}
              Icon={Italic}
              tooltipMessage={"Italic"}
            />
            <EditorButton
              onClick={() => handleSetTypography("strike")}
              iconWidth={2}
              Icon={Strikethrough}
              tooltipMessage={"Strikethrough"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              onClick={() => handleSetTypography("h1", true)}
              iconWidth={2}
              Icon={Heading1}
              tooltipMessage={"Header 1"}
            />
            <EditorButton
              onClick={() => handleSetTypography("h2", true)}
              iconWidth={2}
              Icon={Heading2}
              tooltipMessage={"Header 2"}
            />
            <EditorButton
              onClick={() => handleSetTypography("h3", true)}
              iconWidth={2}
              Icon={Heading3}
              tooltipMessage={"Header 3"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              onClick={() => handleSetTypography("unorderedList", true)}
              iconWidth={2}
              Icon={List}
              tooltipMessage={"Unordered list"}
            />
            <EditorButton
              onClick={() => handleSetTypography("orderedList", true)}
              iconWidth={2}
              Icon={ListOrdered}
              tooltipMessage={"Ordered list"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              iconWidth={2}
              Icon={MessageSquareQuote}
              tooltipMessage={"Quote"}
            />
            <EditorButton iconWidth={2} Icon={Code} tooltipMessage={"Code"} />
            <EditorButton iconWidth={2} Icon={Table} tooltipMessage={"Table"} />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              iconWidth={2}
              Icon={LinkIcon}
              tooltipMessage={"Link"}
            />
            <EditorButton
              iconWidth={2}
              Icon={FileImage}
              tooltipMessage={"Image"}
            />
          </PanelHeader>
          <Textarea
            ref={textarea}
            autoFocus
            value={markdown}
            onChange={(e) => handleMarkdownUpdate(e.target.value)}
            className={
              "h-full w-full resize-none rounded-xl border-0 p-4 focus-visible:ring-0 active:border-0"
            }
            placeholder="Write your Markdown here..."
          />
        </PanelWrapper>
      </ResizablePanel>
      <ResizableHandle
        className={
          "bg-transparent p-2 dark:border-zinc-700 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
        }
        withCustomHandle
      />
      <ResizablePanel minSize={15} defaultSize={50}>
        <PanelWrapper
          className={
            "overflow-hidden rounded-xl dark:border-zinc-700 dark:bg-zinc-800"
          }
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="prose-invert overflow-y-auto p-4 leading-7"
            components={{
              h1: ({ ...props }) => (
                <h1 {...props} className="mb-2 pb-2 text-3xl font-bold" />
              ),
              h2: ({ ...props }) => (
                <h2 {...props} className="mb-2 pb-2 text-2xl font-bold" />
              ),
              h3: ({ ...props }) => (
                <h3 {...props} className="mb-2 pb-2 text-xl font-bold" />
              ),
              p: ({ ...props }) => (
                <p {...props} className="mb-4 overflow-hidden text-ellipsis" />
              ),
              ol: ({ ...props }) => (
                <ol {...props} className={"mb-4 list-decimal ps-10"} />
              ),
              ul: ({ ...props }) => (
                <ul {...props} className={"mb-4 list-disc ps-10"} />
              ),
              hr: ({ ...props }) => (
                <hr {...props} className={"my-4 dark:border-zinc-700"} />
              ),
              code(props) {
                const { children, className, node, ref, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    node={node}
                    PreTag="div"
                    language={match[1]}
                    style={resolvedTheme === "dark" ? vscDarkPlus : vs}
                    className={"rounded-md"}
                    customStyle={{
                      scrollbarWidth: "thin",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    {...rest}
                    className={
                      "rounded-md border border-zinc-300 bg-neutral-200 px-1 py-[0.10rem] font-mono text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                    }
                    ref={ref}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </Markdown>
        </PanelWrapper>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MarkdownEditor;
