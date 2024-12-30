"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import MarkdownBuilder from "@/app/(root)/(challenge)/create-challenge/edit-description/_components/markdown-builder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import RootPanelWrapper from "@/app/(root)/(challenge)/_components/root-panel-wrapper";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import ChallengeDescriptionViewer from "@/app/(root)/(challenge)/create-challenge/_components/challenge-description-viewer";

const MarkdownEditor = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  return (
    <ResizablePanelGroup
      className={"absolute"}
      direction={isDesktop ? "horizontal" : "vertical"}
    >
      <ResizablePanel minSize={15} defaultSize={50}>
        <RootPanelWrapper className={"dark:bg-zinc-800"}>
          <PanelHeader>
            <Link href={"/create-challenge"}>
              <Button
                variant={"link"}
                className={"p-1 font-semibold"}
                size={"sm"}
              >
                Go back to form
              </Button>
            </Link>
          </PanelHeader>
          <ChallengeDescriptionViewer />
        </RootPanelWrapper>
      </ResizablePanel>
      <ResizableHandle
        className={
          "bg-transparent p-2 dark:border-zinc-700 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
        }
        withCustomHandle
      />
      <ResizablePanel minSize={50} defaultSize={50}>
        <RootPanelWrapper className={"dark:bg-[#1e1e1e]"}>
          <MarkdownBuilder />
        </RootPanelWrapper>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MarkdownEditor;
