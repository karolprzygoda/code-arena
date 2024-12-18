"use client";

import { ChangeEvent, useRef, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [url, setUrl] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const { resolvedTheme } = useTheme();

  const direction = useDirection();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

  const handleAddTypography = (
    typographyVariant: Readonly<keyof typeof typographyVariants>,
  ) => {
    const typography = typographyVariants[typographyVariant];
    const textareaElement = textareaRef.current!;
    const { selectionStart, selectionEnd } = textareaElement;

    const selectedText = markdown.slice(selectionStart, selectionEnd);

    const isSpaceVariant = typography.trimEnd() !== typography;

    if (isSpaceVariant) {
      const prefix = typography;
      const currentLineStart =
        markdown.lastIndexOf("\n", selectionStart - 1) + 1;
      const currentLineEnd = markdown.indexOf("\n", selectionEnd);

      const lineEnd = currentLineEnd === -1 ? markdown.length : currentLineEnd;
      const currentLine = markdown.slice(currentLineStart, lineEnd);

      if (currentLine.startsWith(prefix)) {
        const updatedMarkdown =
          markdown.slice(0, currentLineStart) +
          currentLine.slice(prefix.length) +
          markdown.slice(lineEnd);

        handleMarkdownUpdate(updatedMarkdown);

        setTimeout(() => {
          textareaElement.focus();
          textareaElement.setSelectionRange(selectionStart, selectionEnd);
        }, 0);
      } else {
        const updatedMarkdown =
          markdown.slice(0, currentLineStart) +
          prefix +
          currentLine +
          markdown.slice(lineEnd);

        handleMarkdownUpdate(updatedMarkdown);

        setTimeout(() => {
          textareaElement.focus();
          textareaElement.setSelectionRange(
            selectionStart + prefix.length,
            selectionEnd + prefix.length,
          );
        }, 0);
      }
    } else {
      const isAlreadyTypography =
        markdown
          .slice(
            selectionStart - typography.length / 2,
            selectionEnd + typography.length / 2,
          )
          .replace(selectedText, "") === typography;

      if (isAlreadyTypography) {
        const updatedMarkdown =
          markdown.slice(0, selectionStart - typography.length / 2) +
          selectedText +
          markdown.slice(selectionEnd + typography.length / 2, markdown.length);

        handleMarkdownUpdate(updatedMarkdown);

        setTimeout(() => {
          textareaElement.focus();
          textareaElement.setSelectionRange(
            selectionStart - typography.length / 2,
            selectionEnd,
          );
        }, 0);
      } else {
        const newText =
          typography.slice(0, typography.length / 2) +
          selectedText +
          typography.slice(typography.length / 2);

        const updatedMarkdown =
          markdown.slice(0, selectionStart) +
          newText +
          markdown.slice(selectionEnd);

        handleMarkdownUpdate(updatedMarkdown);

        setTimeout(() => {
          const cursorPosition = selectionStart + typography.length / 2;
          textareaElement.focus();
          textareaElement.setSelectionRange(
            cursorPosition,
            cursorPosition + selectedText.length,
          );
        }, 0);
      }
    }
  };

  const handleAddLink = () => {
    const textareaElement = textareaRef.current!;
    const { selectionStart, selectionEnd } = textareaElement;
    const markdownLink = `[${anchorText}](${url})`;

    const updatedMarkdown =
      markdown.slice(0, selectionStart) +
      markdownLink +
      markdown.slice(selectionEnd);
    setAnchorText("");
    setUrl("");
    handleMarkdownUpdate(updatedMarkdown);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAnchorTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnchorText(e.target.value);
  };

  return (
    <ResizablePanelGroup direction={direction}>
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
              a: ({ ...props }) => (
                <a {...props} className={"whitespace-nowrap text-blue-500"} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  {...props}
                  className={
                    "mx-0 my-[10px] border-l-8 border-gray-400 bg-zinc-200 px-2 py-[10px] dark:border-gray-200 dark:bg-zinc-700"
                  }
                />
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
      <ResizableHandle
        className={
          "bg-transparent p-2 dark:border-zinc-700 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
        }
        withCustomHandle
      />
      <ResizablePanel minSize={30} defaultSize={50}>
        <PanelWrapper
          className={"overflow-hidden rounded-xl dark:bg-[#1e1e1e]"}
        >
          <PanelHeader className={"gap-4 px-4"}>
            <EditorButton
              onClick={() => handleAddTypography("bold")}
              iconWidth={2}
              Icon={Bold}
              tooltipMessage={"Bold"}
            />
            <EditorButton
              onClick={() => handleAddTypography("italic")}
              iconWidth={2}
              Icon={Italic}
              tooltipMessage={"Italic"}
            />
            <EditorButton
              onClick={() => handleAddTypography("strike")}
              iconWidth={2}
              Icon={Strikethrough}
              tooltipMessage={"Strikethrough"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              onClick={() => handleAddTypography("h1")}
              iconWidth={2}
              Icon={Heading1}
              tooltipMessage={"Header 1"}
            />
            <EditorButton
              onClick={() => handleAddTypography("h2")}
              iconWidth={2}
              Icon={Heading2}
              tooltipMessage={"Header 2"}
            />
            <EditorButton
              onClick={() => handleAddTypography("h3")}
              iconWidth={2}
              Icon={Heading3}
              tooltipMessage={"Header 3"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              onClick={() => handleAddTypography("unorderedList")}
              iconWidth={2}
              Icon={List}
              tooltipMessage={"Unordered list"}
            />
            <EditorButton
              onClick={() => handleAddTypography("orderedList")}
              iconWidth={2}
              Icon={ListOrdered}
              tooltipMessage={"Ordered list"}
            />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <EditorButton
              onClick={() => handleAddTypography("quote")}
              iconWidth={2}
              Icon={MessageSquareQuote}
              tooltipMessage={"Quote"}
            />
            <EditorButton
              onClick={() => handleAddTypography("codeBlock")}
              iconWidth={2}
              Icon={Code}
              tooltipMessage={"Code"}
            />
            <EditorButton iconWidth={2} Icon={Table} tooltipMessage={"Table"} />
            <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <EditorButton
                  iconWidth={2}
                  Icon={LinkIcon}
                  tooltipMessage={"Link"}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Please provide a URL and text for your link.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide data below to add a link in markdowns.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className={"mt-3 flex flex-col gap-6"}>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="anchorInput">Visible text</Label>
                    <Input
                      value={anchorText}
                      onChange={handleAnchorTextChange}
                      id="anchorInput"
                      placeholder="here is the link"
                    />
                  </div>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="urlInput">URL</Label>
                    <Input
                      value={url}
                      onChange={handleUrlChange}
                      id="urlInput"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <AlertDialogFooter className={"mt-3"}>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddLink}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <EditorButton
              iconWidth={2}
              Icon={FileImage}
              tooltipMessage={"Image"}
            />
          </PanelHeader>
          <Textarea
            ref={textareaRef}
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
    </ResizablePanelGroup>
  );
};

export default MarkdownEditor;
