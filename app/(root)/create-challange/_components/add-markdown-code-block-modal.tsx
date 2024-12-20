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

type AddCodeBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  setMarkdown: (updatedMarkdown: string) => void;
  textAreaElement: HTMLTextAreaElement;
};

const AddMarkdownCodeBlockModal = ({
  isOpen,
  onClose,
  markdown,
  setMarkdown,
  textAreaElement,
}: AddCodeBlockModalProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Lowercase<Language>>("javascript");

  const handleAddCodeBlock = () => {
    const { selectionStart, selectionEnd } = textAreaElement!;
    const markdownCodeBlock = `\`\`\`${language}\n${code}\n\`\`\``;

    const updatedMarkdown =
      markdown.slice(0, selectionStart) +
      markdownCodeBlock +
      markdown.slice(selectionEnd);
    setCode("");
    setLanguage("javascript");
    setMarkdown(updatedMarkdown);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Lowercase<Language>);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please provide code and language.</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide data below to add your code to the markdown.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className={"mt-3 flex flex-col gap-6"}>
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
};

export default AddMarkdownCodeBlockModal;
