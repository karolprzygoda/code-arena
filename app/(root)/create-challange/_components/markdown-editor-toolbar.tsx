"use client";

import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import {
  Bold,
  Brackets,
  FileImage,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  MessageSquareQuote,
  Strikethrough,
  Table,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import { useStore } from "zustand/index";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { useShallow } from "zustand/react/shallow";
import { TypographyVariant } from "@/lib/types";
import AddCodeBlockButton from "@/app/(root)/create-challange/_components/add-code-block-button";
import AddMarkdownLinkButton from "@/app/(root)/create-challange/_components/add-markdown-link-button";

const MarkdownEditorToolbar = () => {
  const { markdown, setMarkdown, textAreaElement } = useStore(
    useMarkdownEditorStore,
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
      textAreaElement: state.textAreaElement,
    })),
  );

  const typographyMap: Record<TypographyVariant, (text: string) => string> = {
    bold: (text) => `**${text}**`,
    italic: (text) => `*${text}*`,
    strike: (text) => `~~${text}~~`,
    inlineCode: (text) => `\`${text}\``,
    quote: (text) => `> ${text}`,
    unorderedList: (text) => `- ${text}`,
    orderedList: (text) => `1. ${text}`,
    h1: (text) => `# ${text}`,
    h2: (text) => `## ${text}`,
    h3: (text) => `### ${text}`,
  };

  const getUpdatedText = (typographyVariant: TypographyVariant, text: string) =>
    typographyMap[typographyVariant](text);

  const getFormatLength = (
    updatedText: string,
    selectedText: string,
    typographyVariant: TypographyVariant,
  ) => {
    const formatChars = updatedText.length - selectedText.length;

    const singleWrapVariants: TypographyVariant[] = [
      "bold",
      "italic",
      "strike",
      "inlineCode",
    ];

    return singleWrapVariants.includes(typographyVariant)
      ? formatChars / 2
      : formatChars;
  };

  const getSelectedText = () => {
    const { selectionStart, selectionEnd } = textAreaElement!;
    return {
      selectionStart,
      selectionEnd,
      selectedText: markdown.slice(selectionStart, selectionEnd),
    };
  };

  const getUpdatedMarkdown = (
    updatedText: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
    return (
      markdown.slice(0, selectionStart) +
      updatedText +
      markdown.slice(selectionEnd)
    );
  };

  const handleAddTypography = (typographyVariant: TypographyVariant) => {
    const { selectedText, selectionStart, selectionEnd } = getSelectedText();
    const updatedText = getUpdatedText(typographyVariant, selectedText);
    const updatedMarkdown = getUpdatedMarkdown(
      updatedText,
      selectionStart,
      selectionEnd,
    );
    const formatLength = getFormatLength(
      updatedText,
      selectedText,
      typographyVariant,
    );

    setMarkdown(updatedMarkdown);

    setTimeout(() => {
      textAreaElement?.focus();
      textAreaElement?.setSelectionRange(
        selectionStart + formatLength,
        selectionEnd + formatLength,
      );
    }, 0);
  };

  return (
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
        onClick={() => handleAddTypography("inlineCode")}
        iconWidth={2}
        Icon={Brackets}
        tooltipMessage={"Inline code"}
      />
      <AddCodeBlockButton />
      <EditorButton iconWidth={2} Icon={Table} tooltipMessage={"Table"} />
      <Separator className={"h-3/4 w-0.5"} orientation="vertical" />
      <AddMarkdownLinkButton />
      <EditorButton iconWidth={2} Icon={FileImage} tooltipMessage={"Image"} />
    </PanelHeader>
  );
};

export default MarkdownEditorToolbar;
