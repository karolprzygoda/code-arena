"use client";

import EditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/editor-button";
import { RotateCcw } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
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
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type CodeResetButtonProps = {
  label?: string;
  className?: string;
  defaultCode: PrismaJson.DefaultCodeType;
};

const CodeResetButton = ({
  label,
  className,
  defaultCode,
}: CodeResetButtonProps) => {
  const { setCode, language } = useEditorStore(
    useShallow((state) => ({
      setCode: state.setCode,
      language: state.language,
    })),
  );

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleReset = () => {
    setCode(defaultCode[language]);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <EditorButton
            className={className}
            tooltipMessage={"Reset code to default"}
            tooltipSide={"left"}
            Icon={RotateCcw}
            label={label}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete code
              that you have written.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer dismissible={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <EditorButton
          className={className}
          tooltipMessage={"Reset code to default"}
          tooltipSide={"left"}
          Icon={RotateCcw}
          label={label}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete code that
            you have written.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <Button onClick={handleReset}>Continue</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CodeResetButton;
