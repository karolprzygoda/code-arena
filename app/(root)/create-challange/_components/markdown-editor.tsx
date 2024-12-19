"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import useDirection from "@/hooks/use-direction";
import { useStore } from "zustand/index";
import { useShallow } from "zustand/react/shallow";
import { useMarkdownEditorStore } from "@/stores/markdown-editor-store";
import MarkdownRenderer from "@/app/(root)/create-challange/_components/markdown-renderer";
import MarkdownBuilder from "@/app/(root)/create-challange/_components/markdown-builder";

const MarkdownEditor = () => {
  const { markdown } = useStore(
    useMarkdownEditorStore,
    useShallow((state) => ({
      markdown: state.markdown,
    })),
  );

  const direction = useDirection();

  return (
    <ResizablePanelGroup direction={direction}>
      <ResizablePanel minSize={15} defaultSize={50}>
        <PanelWrapper
          className={
            "overflow-hidden rounded-xl dark:border-zinc-700 dark:bg-zinc-800"
          }
        >
          <MarkdownRenderer markdown={markdown} />
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
          className={"overflow-hidden rounded-xl dark:bg-[#1e1e1e]"}
        >
          <MarkdownBuilder />
        </PanelWrapper>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MarkdownEditor;
