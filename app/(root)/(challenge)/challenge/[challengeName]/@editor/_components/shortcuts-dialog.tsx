"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditorShortcuts } from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/editor-shortcuts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type ShortcutsDialogProps = {
  isDesktop: boolean;
  isOpen: boolean;
  handleClose: () => void;
};

const ShortcutsDialog = ({
  isDesktop,
  isOpen,
  handleClose,
}: ShortcutsDialogProps) => {
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
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
    <Drawer open={isOpen} onOpenChange={handleClose}>
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

export default ShortcutsDialog;
