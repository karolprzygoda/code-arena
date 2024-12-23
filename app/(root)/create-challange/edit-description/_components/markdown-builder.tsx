"use client";

import MarkdownEditorHeaderToolbar from "@/app/(root)/create-challange/edit-description/_components/markdown-editor-header-toolbar";
import React, { useRef, useState } from "react";
import { ContextMenu } from "@/components/ui/context-menu";
import {
  Bold,
  Brackets,
  Code,
  FileImageIcon,
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
import { TypographyAction, TypographyVariant } from "@/lib/types";
import AddMarkdownCodeBlockModal from "@/app/(root)/create-challange/edit-description/_components/add-markdown-code-block-modal";
import AddMarkdownLinkModal from "@/app/(root)/create-challange/edit-description/_components/add-markdown-link-modal";
import MarkdownEditorContextToolbar from "@/app/(root)/create-challange/edit-description/_components/markdown-editor-context-toolbar";
import MarkdownEditorTextarea from "@/app/(root)/create-challange/edit-description/_components/markdown-editor-textarea";
import AddMarkdownImageModal from "@/app/(root)/create-challange/edit-description/_components/add-markdown-image-modal";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";

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

const getSelectedText = (
  markdown: string,
  textAreaElement: HTMLTextAreaElement,
) => {
  const { selectionStart, selectionEnd } = textAreaElement;
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
  markdown: string,
) => {
  return (
    markdown.slice(0, selectionStart) +
    updatedText +
    markdown.slice(selectionEnd)
  );
};

const MarkdownBuilder = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isModalOpen, setIsModalOpen] = useState({
    codeModal: false,
    linkModal: false,
    imageModal: false,
  });

  const handleOpenModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: true });
  };

  const handleCloseModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: false });
  };

  const handleAddTypography = (typographyVariant: TypographyVariant) => {
    const markdownStore = useMarkdownEditorStore.getState();
    const { selectedText, selectionStart, selectionEnd } = getSelectedText(
      markdownStore.markdown,
      textareaRef.current!,
    );
    const updatedText = getUpdatedText(typographyVariant, selectedText);
    const updatedMarkdown = getUpdatedMarkdown(
      updatedText,
      selectionStart,
      selectionEnd,
      markdownStore.markdown,
    );
    const formatLength = getFormatLength(
      updatedText,
      selectedText,
      typographyVariant,
    );

    markdownStore.setMarkdown(updatedMarkdown);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        selectionStart + formatLength,
        selectionEnd + formatLength,
      );
    }, 0);
  };

  const actions: TypographyAction[] = [
    {
      id: "bold",
      label: "Make text bold",
      Icon: Bold,
      onClick: () => handleAddTypography("bold"),
    },
    {
      id: "italic",
      label: "Apply italics",
      Icon: Italic,
      onClick: () => handleAddTypography("italic"),
    },
    {
      id: "strike",
      label: "Apply Strike through",
      Icon: Strikethrough,
      separator: true,
      onClick: () => handleAddTypography("strike"),
    },
    {
      id: "h1",
      label: "Add heading 1",
      Icon: Heading1,
      onClick: () => handleAddTypography("h1"),
    },
    {
      id: "h2",
      label: "Add heading 2",
      Icon: Heading2,
      onClick: () => handleAddTypography("h2"),
    },
    {
      id: "h3",
      label: "Add heading 3",
      Icon: Heading3,
      separator: true,
      onClick: () => handleAddTypography("h3"),
    },
    {
      id: "unorderedList",
      label: "Create Bullet list",
      Icon: List,
      onClick: () => handleAddTypography("unorderedList"),
    },
    {
      id: "orderedList",
      label: "Create Numbered list",
      Icon: ListOrdered,
      separator: true,
      onClick: () => handleAddTypography("orderedList"),
    },
    {
      id: "quote",
      label: "Quote section",
      Icon: MessageSquareQuote,
      onClick: () => handleAddTypography("quote"),
    },
    {
      id: "inlineCode",
      label: "Inline code snippet",
      Icon: Brackets,
      onClick: () => handleAddTypography("inlineCode"),
    },
    {
      id: "codeBlock",
      label: "Code block snippet",
      Icon: Code,
      onClick: () => handleOpenModal("codeModal"),
    },
    {
      id: "table",
      label: "Insert table",
      Icon: Table,
      separator: true,
      onClick: () => console.log("XD"),
    },
    {
      id: "markdownLink",
      label: "Insert table",
      Icon: LinkIcon,
      onClick: () => handleOpenModal("linkModal"),
    },
    {
      id: "image",
      label: "Provide image",
      Icon: FileImageIcon,
      onClick: () => handleOpenModal("imageModal"),
    },
  ];

  return (
    <>
      <MarkdownEditorHeaderToolbar actions={actions} />
      <ContextMenu modal={false}>
        <MarkdownEditorTextarea ref={textareaRef} />
        <MarkdownEditorContextToolbar actions={actions} />
      </ContextMenu>
      <AddMarkdownCodeBlockModal
        isOpen={isModalOpen.codeModal}
        onClose={() => handleCloseModal("codeModal")}
        textAreaElement={textareaRef.current!}
      />
      <AddMarkdownLinkModal
        isOpen={isModalOpen.linkModal}
        onClose={() => handleCloseModal("linkModal")}
        textAreaElement={textareaRef.current!}
      />
      <AddMarkdownImageModal
        isOpen={isModalOpen.imageModal}
        onClose={() => handleCloseModal("imageModal")}
        textAreaElement={textareaRef.current!}
      />
    </>
  );
};

export default MarkdownBuilder;
