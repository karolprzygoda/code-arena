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
import { ChangeEvent, RefObject, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import useMarkdownContext from "@/hooks/use-markdown-context";
import { useShallow } from "zustand/react/shallow";
import { editor } from "monaco-editor";
import { getSelectionStartEnd } from "@/lib/utils";

type AddMarkdownLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editorRef: RefObject<editor.IStandaloneCodeEditor>;
};

const AddMarkdownLinkModal = ({
  isOpen,
  onClose,
  editorRef,
}: AddMarkdownLinkModalProps) => {
  const [url, setUrl] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { addToMarkdown } = useMarkdownContext(
    useShallow((state) => ({
      addToMarkdown: state.addToMarkdown,
    })),
  );

  const handleAddLink = () => {
    const { selectionStart, selectionEnd } = getSelectionStartEnd(editorRef)!;
    const markdownLink = `[${anchorText}](${url})`;
    addToMarkdown(selectionStart, selectionEnd, markdownLink);
    setAnchorText("");
    setUrl("");
    onClose();
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAnchorTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnchorText(e.target.value);
  };

  if (isDesktop) {
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
  }

  return (
    <Drawer modal open={isOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            Please provide a URL and text for your link.
          </DrawerTitle>
          <DrawerDescription>
            Please provide data below to add a link to the markdown.
          </DrawerDescription>
        </DrawerHeader>
        <div className={"mt-3 flex flex-col gap-6 px-4"}>
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
        <DrawerFooter className={"mt-3 gap-4"}>
          <Button variant={"outline"} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddLink}>Continue</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddMarkdownLinkModal;
