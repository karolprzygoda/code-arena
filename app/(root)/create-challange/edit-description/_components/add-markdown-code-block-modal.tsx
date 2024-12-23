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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useState } from "react";
import { Language } from "@prisma/client";
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
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";

type AddCodeBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  textAreaElement: HTMLTextAreaElement;
};

const AddMarkdownCodeBlockModal = ({
  isOpen,
  onClose,
  textAreaElement,
}: AddCodeBlockModalProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Lowercase<Language> | "graph">(
    "javascript",
  );
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleAddCodeBlock = () => {
    const { selectionStart, selectionEnd } = textAreaElement!;
    const markdownCodeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    const markdownStore = useMarkdownEditorStore.getState();

    const updatedMarkdown =
      markdownStore.markdown.slice(0, selectionStart) +
      markdownCodeBlock +
      markdownStore.markdown.slice(selectionEnd);
    setCode("");
    setLanguage("javascript");
    markdownStore.setMarkdown(updatedMarkdown);
    onClose();
  };

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (value: Lowercase<Language> | "graph") => {
    setLanguage(value);
  };

  if (isDesktop) {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Please provide code and language.
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide data below to add your code to the markdown.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className={"mt-3 flex flex-col gap-6"}>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="language">Choose language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent id={"language"}>
                  <SelectItem className={"cursor-pointer"} value="javascript">
                    Javascript
                  </SelectItem>
                  <SelectItem className={"cursor-pointer"} value="python">
                    Python
                  </SelectItem>
                  <SelectItem className={"cursor-pointer"} value="java">
                    Java
                  </SelectItem>
                  <SelectItem className={"cursor-pointer"} value="mermaid">
                    Graph
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="anchorInput">Your code</Label>
              <Textarea
                className={"h-40 resize-none"}
                style={{ scrollbarWidth: "thin" }}
                value={code}
                onChange={handleCodeChange}
                id="anchorInput"
                placeholder="console.log('Hello World');"
              />
            </div>
          </div>
          <AlertDialogFooter className={"mt-3"}>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddCodeBlock}>
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
          <DrawerTitle>Please provide code and language.</DrawerTitle>
          <DrawerDescription>
            Please provide data below to add your code to the markdown.
          </DrawerDescription>
        </DrawerHeader>
        <div className={"mt-3 flex flex-col gap-6 px-4"}>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="language">Choose language</Label>
            <Select value={language} onValueChange={() => handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent id={"language"}>
                <SelectItem className={"cursor-pointer"} value="javascript">
                  Javascript
                </SelectItem>
                <SelectItem className={"cursor-pointer"} value="python">
                  Python
                </SelectItem>
                <SelectItem className={"cursor-pointer"} value="java">
                  Java
                </SelectItem>
                <SelectItem className={"cursor-pointer"} value="mermaid">
                  Graph
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="anchorInput">Your code</Label>
            <Textarea
              className={"h-40 resize-none"}
              style={{ scrollbarWidth: "thin" }}
              value={code}
              onChange={handleCodeChange}
              id="anchorInput"
              placeholder="console.log('Hello World');"
            />
          </div>
        </div>
        <DrawerFooter className={"mt-3 gap-4"}>
          <Button variant={"outline"} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddCodeBlock}>Continue</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddMarkdownCodeBlockModal;
