"use client";

import { Settings } from "lucide-react";
import EditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/editor-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsForm } from "@/app/(root)/challange/_components/settings-form";
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

type SettingsButtonProps = {
  label?: string;
  className?: string;
};

const SettingsButton = ({ label, className }: SettingsButtonProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <EditorButton
            tooltipMessage={"Settings"}
            Icon={Settings}
            label={label}
            className={className}
          />
        </DialogTrigger>
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <EditorButton
          tooltipMessage={"Settings"}
          Icon={Settings}
          label={label}
          className={className}
        />
      </DrawerTrigger>
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

export default SettingsButton;
