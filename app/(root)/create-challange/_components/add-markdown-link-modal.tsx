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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

type AddMarkdownLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  setMarkdown: (updatedMarkdown: string) => void;
  textAreaElement: HTMLTextAreaElement;
};

const AddMarkdownLinkModal = ({
  isOpen,
  onClose,
  markdown,
  setMarkdown,
  textAreaElement,
}: AddMarkdownLinkModalProps) => {
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
    <AlertDialog open={isOpen}>
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
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddLink}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddMarkdownLinkModal;
