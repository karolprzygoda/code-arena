"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditorShortcuts } from "@/app/(root)/challange/[challangeName]/@editor/_components/editor-shortcuts";
import { SquareSlash } from "lucide-react";
import EditorButton from "@/app/(root)/challange/_components/buttons/editor-button";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type ShortcutButtonProps = {
  label?: string;
  className?: string;
};

const ShortcutButton = ({ label, className }: ShortcutButtonProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <EditorButton
            tooltipMessage={"Shortcuts"}
            Icon={SquareSlash}
            label={label}
            className={className}
            title={"Open Shortcuts"}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shortcuts</DialogTitle>
            <DialogDescription>All available Shortcuts</DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <EditorShortcuts />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <EditorButton
          tooltipMessage={"Shortcuts"}
          Icon={SquareSlash}
          label={label}
          className={className}
          title={"Open Shortcuts"}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Shortcuts</DrawerTitle>
          <DrawerDescription>All available Shortcuts</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <EditorShortcuts />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ShortcutButton;
