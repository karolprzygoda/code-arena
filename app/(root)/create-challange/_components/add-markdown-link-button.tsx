"use client";

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
import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import { LinkIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { useStore } from "zustand/index";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import { useShallow } from "zustand/react/shallow";

const AddMarkdownLinkButton = () => {
  const { markdown, setMarkdown, textAreaElement } = useStore(
    useMarkdownEditorStore,
    useShallow((state) => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
      textAreaElement: state.textAreaElement,
    })),
  );

  const [url, setUrl] = useState("");
  const [anchorText, setAnchorText] = useState("");

  const handleAddLink = () => {
    const { selectionStart, selectionEnd } = textAreaElement!;
    const markdownLink = `[${anchorText}](${url})`;

    const updatedMarkdown =
      markdown.slice(0, selectionStart) +
      markdownLink +
      markdown.slice(selectionEnd);
    setAnchorText("");
    setUrl("");
    setMarkdown(updatedMarkdown);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAnchorTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnchorText(e.target.value);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <EditorButton iconWidth={2} Icon={LinkIcon} tooltipMessage={"Link"} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Please provide a URL and text for your link.
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please provide data below to add a link to the markdown.
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
  );
};

export default AddMarkdownLinkButton;
