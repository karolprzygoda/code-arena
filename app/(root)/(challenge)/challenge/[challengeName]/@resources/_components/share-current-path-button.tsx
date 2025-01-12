"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share } from "lucide-react";

import CopyToClipBoardButton from "@/components/copy-to-clipboard-button";
import DescriptionActionButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@resources/_components/description-action-button";

const ShareCurrentPathButton = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <DescriptionActionButton tooltipMessage={"Share"}>
            <Share />
          </DescriptionActionButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>
              Copy this url to share with your friends!
            </DialogDescription>
          </DialogHeader>
          <code className={"rounded-md border bg-black px-4 py-2"}>
            {window.location.href}
          </code>
          <DialogFooter>
            <CopyToClipBoardButton data={window.location.href} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DescriptionActionButton tooltipMessage={"Share"}>
          <Share />
        </DescriptionActionButton>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Copy this url to share with your friends!
          </DialogDescription>
        </DrawerHeader>
        <div className={"w-full px-2"}>
          <code
            className={
              "block w-full break-words rounded-md border bg-black px-4 py-2"
            }
          >
            {window.location.href}
          </code>
        </div>
        <DrawerFooter>
          <CopyToClipBoardButton data={window.location.href} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareCurrentPathButton;
