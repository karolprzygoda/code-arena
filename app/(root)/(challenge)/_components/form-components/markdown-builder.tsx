"use client";

import MarkdownEditorHeaderToolbar from "@/app/(root)/(challenge)/_components/form-components/markdown-editor-header-toolbar";
import React, { useRef, useState } from "react";
import { ContextMenu } from "@/components/ui/context-menu";
import {
  Bold,
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
  SquareChartGanttIcon,
  Strikethrough,
} from "lucide-react";
import { TypographyAction, TypographyVariant } from "@/lib/types";
import AddMarkdownCodeBlockModal from "@/app/(root)/(challenge)/_components/form-components/add-markdown-code-block-modal";
import AddMarkdownLinkModal from "@/app/(root)/(challenge)/_components/form-components/add-markdown-link-modal";
import MarkdownEditorContextToolbar from "@/app/(root)/(challenge)/_components/form-components/markdown-editor-context-toolbar";
import MarkdownEditorTextarea from "@/app/(root)/(challenge)/_components/form-components/markdown-editor-textarea";
import AddMarkdownImageModal from "@/app/(root)/(challenge)/_components/form-components/add-markdown-image-modal";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import { useShallow } from "zustand/react/shallow";
import {
  cn,
  getSelectionStartEnd,
  setSelectionFromStartEnd,
  typographyMap,
} from "@/lib/utils";
import useMarkdownContext from "@/hooks/use-markdown-context";
import { editor } from "monaco-editor";

const getFormatLength = (
  selectionStart: number,
  selectionEnd: number,
  typographyVariant: TypographyVariant,
) => {
  const formatChars =
    selectionStart -
    selectionEnd +
    typographyMap[typographyVariant].length -
    (selectionStart - selectionEnd);

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

type MarkdownBuilderProps = {
  className?: string;
};

const MarkdownBuilder = ({ className }: MarkdownBuilderProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [isModalOpen, setIsModalOpen] = useState({
    codeModal: false,
    linkModal: false,
    imageModal: false,
  });

  const { updateMarkdown } = useMarkdownContext(
    useShallow((state) => ({
      updateMarkdown: state.updateMarkdown,
    })),
  );

  const handleOpenModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: true });
  };

  const handleCloseModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: false });
  };

  const handleAddTypography = (typographyVariant: TypographyVariant) => {
    const { selectionStart, selectionEnd } = getSelectionStartEnd(editorRef)!;
    updateMarkdown(typographyVariant, selectionStart, selectionEnd);

    const selectionRange = getFormatLength(
      selectionStart,
      selectionEnd,
      typographyVariant,
    );

    setTimeout(() => {
      setSelectionFromStartEnd(
        editorRef,
        selectionStart + selectionRange,
        selectionEnd + selectionRange,
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
      Icon: Code,
      onClick: () => handleAddTypography("inlineCode"),
    },
    {
      id: "codeBlock",
      label: "Code block snippet",
      Icon: SquareChartGanttIcon,
      separator: true,
      onClick: () => handleOpenModal("codeModal"),
    },
    {
      id: "markdownLink",
      label: "Insert link",
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
    <RootPanelWrapper className={cn("min-h-full dark:bg-[#1e1e1e]", className)}>
      <MarkdownEditorHeaderToolbar actions={actions} />
      <ContextMenu modal={false}>
        <MarkdownEditorTextarea ref={editorRef} />
        <MarkdownEditorContextToolbar actions={actions} />
      </ContextMenu>
      <AddMarkdownCodeBlockModal
        isOpen={isModalOpen.codeModal}
        onClose={() => handleCloseModal("codeModal")}
        editorRef={editorRef}
      />
      <AddMarkdownLinkModal
        isOpen={isModalOpen.linkModal}
        onClose={() => handleCloseModal("linkModal")}
        editorRef={editorRef}
      />
      <AddMarkdownImageModal
        isOpen={isModalOpen.imageModal}
        onClose={() => handleCloseModal("imageModal")}
        editorRef={editorRef}
      />
    </RootPanelWrapper>
  );
};

export default MarkdownBuilder;
