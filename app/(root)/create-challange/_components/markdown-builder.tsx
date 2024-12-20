"use client";

import MarkdownEditorHeaderToolbar from "@/app/(root)/create-challange/_components/markdown-editor-header-toolbar";
import { useEffect, useRef, useState } from "react";
import { useStore } from "zustand/index";
import { useShallow } from "zustand/react/shallow";
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
import AddMarkdownCodeBlockModal from "@/app/(root)/create-challange/_components/add-markdown-code-block-modal";
import AddMarkdownLinkModal from "@/app/(root)/create-challange/_components/add-markdown-link-modal";
import MarkdownEditorContextToolbar from "@/app/(root)/create-challange/_components/markdown-editor-context-toolbar";
import MarkdownEditorTextarea from "@/app/(root)/create-challange/_components/markdown-editor-textarea";
import {
  useMarkdownEditorStore,
  useMarkdownTemporalStore,
} from "@/stores/markdown-editor-store";

const MarkdownBuilder = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaElement = textareaRef.current!;
  const { markdown, setMarkdown } = useStore(
    useMarkdownEditorStore,
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
    })),
  );

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

  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [openLinkModal, setOpenLinkModal] = useState(false);

  const handleOpenLinkModal = () => {
    setOpenCodeModal(true);
  };

  const handleCloseLinkModal = () => {
    setOpenLinkModal(false);
  };

  const handleOpenCodeModal = () => {
    setOpenCodeModal(true);
  };

  const handleCloseCodeModal = () => {
    setOpenCodeModal(false);
  };

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
      onClick: () => handleOpenCodeModal(),
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
      onClick: () => handleOpenLinkModal(),
    },
    {
      id: "image",
      label: "Provide image",
      Icon: FileImageIcon,
      onClick: () => console.log("XD"),
    },
  ];

  return (
    <>
      <MarkdownEditorHeaderToolbar actions={actions} />
      <ContextMenu modal={false}>
        <MarkdownEditorTextarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <MarkdownEditorContextToolbar actions={actions} />
      </ContextMenu>
      <AddMarkdownCodeBlockModal
        isOpen={openCodeModal}
        onClose={handleCloseCodeModal}
        markdown={markdown}
        setMarkdown={setMarkdown}
        textAreaElement={textAreaElement!}
      />
      <AddMarkdownLinkModal
        isOpen={openLinkModal}
        onClose={handleCloseLinkModal}
        markdown={markdown}
        setMarkdown={setMarkdown}
        textAreaElement={textAreaElement!}
      />
    </>
  );
};

export default MarkdownBuilder;
