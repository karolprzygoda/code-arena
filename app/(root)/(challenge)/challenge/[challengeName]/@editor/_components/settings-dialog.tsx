"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SettingsForm } from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/settings-form";

type SettingsDialogProps = {
  isDesktop: boolean;
  isOpen: boolean;
  handleClose: () => void;
};

const SettingsDialog = ({
  isDesktop,
  isOpen,
  handleClose,
}: SettingsDialogProps) => {
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your Settings</DialogDescription>
          </DialogHeader>
          <SettingsForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your Settings</DrawerDescription>
        </DrawerHeader>
        <div className={"p-4"}>
          <SettingsForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDialog;
