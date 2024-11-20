"use client";

import PanelHeader from "@/components/dashboard/panel-header";
import EditorButton from "@/components/dashboard/editor-button";
import {
  ArrowRightLeft,
  Maximize2,
  RotateCcw,
  Settings,
  SquareSlash,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import PanelWrapper from "@/components/dashboard/panel-wrapper";

const CodePanel = () => {
  const { resolvedTheme } = useTheme();

  return (
    <ResizablePanel defaultSize={75}>
      <PanelWrapper className={"rounded-none border-0 dark:bg-[#1e1e1e]"}>
        <PanelHeader className={"justify-end gap-4 px-3"}>
          <EditorButton Icon={RotateCcw} />
          <EditorButton Icon={SquareSlash} />
          <EditorButton Icon={Settings} />
          <EditorButton Icon={ArrowRightLeft} />
          <EditorButton Icon={Maximize2} />
        </PanelHeader>
        <Editor
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
          }}
          defaultLanguage="typescript"
          defaultValue={"export default function solution(){" + "}"}
        />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default CodePanel;
