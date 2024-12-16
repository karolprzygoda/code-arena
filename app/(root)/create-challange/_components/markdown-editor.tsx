"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
  Heading,
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

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");

  const direction = useDirection();
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const { addToHistory } = useUndo(setMarkdown);

  const typographyVariants = {
    bold: "****",
    italic: "**",
    strike: "~~~~",
    header: "#",
  };

  const handleMarkdownUpdate = (newText: string) => {
    setMarkdown(newText);
    addToHistory(newText);
  };

  const handleSetTypography = (
    typographyVariant: keyof typeof typographyVariants,
  ) => {
    const typography = typographyVariants[typographyVariant];
    const textareaElement = textarea.current!;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;

    const beforeText = markdown.slice(0, start);
    const selectedText = markdown.slice(start, end);
    const afterText = markdown.slice(end);

    if (start !== end) {
      const typographyVariantText =
        typography.slice(0, typography.length / 2) +
        selectedText +
        typography.slice(typography.length / 2);

      const newText = beforeText + typographyVariantText + afterText;
      setMarkdown(newText);

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
      setMarkdown(newText);

      setTimeout(() => {
        const cursorPosition = start + typography.length / 2;
        textareaElement.setSelectionRange(cursorPosition, cursorPosition);
        textareaElement.focus();
      }, 0);
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
              onClick={() => handleSetTypography("header")}
              iconWidth={2}
              Icon={Heading}
              tooltipMessage={"Header"}
            />
            <EditorButton
              onClick={() => handleSetTypography("strike")}
              iconWidth={2}
              Icon={Strikethrough}
              tooltipMessage={"Strikethrough"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              iconWidth={2}
              Icon={List}
              tooltipMessage={"Unordered list"}
            />
            <EditorButton
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
            spellCheck
            autoFocus
            value={markdown}
            ref={textarea}
            onChange={(e) => handleMarkdownUpdate(e.target.value)}
            className={
              "shadcn-scrollbar h-full w-full resize-none rounded-xl border-0 p-4 focus-visible:ring-0 active:border-0"
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
            className="prose-invert overflow-y-auto p-4 leading-7 prose-h3:text-xl"
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
              code(props) {
                const { children, className, node, ref, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    node={node}
                    PreTag="div"
                    language={match[1]}
                    style={vscDarkPlus}
                    className={"rounded-md"}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className} ref={ref}>
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
