"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import useDirection from "@/hooks/use-direction";

import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import MarkdownBuilder from "@/app/(root)/create-challange/edit-description/_components/markdown-builder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MarkdownWrapper from "@/app/(root)/create-challange/edit-description/_components/markdown-wrapper";

const MarkdownEditor = () => {
  const direction = useDirection();
  const hasHydrated = useMarkdownEditorStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  return (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel minSize={15} defaultSize={50}>
        <PanelWrapper
          className={
            "relative overflow-hidden rounded-2xl dark:border-zinc-700 dark:bg-zinc-800"
          }
        >
          <div
            className={
              "sticky top-0 flex min-h-[44px] items-center justify-end border-b border-zinc-300 p-1 dark:border-zinc-700"
            }
          >
            <Link href={"/create-challange"}>
              <Button variant={"link"} className={"font-semibold"} size={"sm"}>
                Go back to form
              </Button>
            </Link>
          </div>
          <MarkdownWrapper />
        </PanelWrapper>
      </ResizablePanel>
      <ResizableHandle
        className={
          "bg-transparent p-2 dark:border-zinc-700 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
        }
        withCustomHandle
      />
      <ResizablePanel minSize={50} defaultSize={50}>
        <PanelWrapper
          className={"overflow-hidden rounded-2xl dark:bg-[#1e1e1e]"}
        >
          <MarkdownBuilder />
        </PanelWrapper>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MarkdownEditor;
