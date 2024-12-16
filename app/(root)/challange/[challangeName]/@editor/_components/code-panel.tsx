"use client";

import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import PanelWrapper from "@/app/(root)/challange/_components/panel-wrapper";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "zustand";
import { usePreferencesStore } from "@/stores/user-preferences-store";
import { useEffect } from "react";

type CodePanelProps = {
  defaultCode: PrismaJson.DefaultCodeType;
};

const CodePanel = ({ defaultCode }: CodePanelProps) => {
  const { resolvedTheme } = useTheme();
  const { code, language, setCode, isPending } = useStore(
    useEditorStore,
    useShallow((state) => ({
      code: state.code,
      language: state.language,
      setCode: state.setCode,
      isPending: state.isPending,
    })),
  );

  const { settings } = useStore(
    usePreferencesStore,
    useShallow((state) => ({
      settings: state.settings,
    })),
  );

  useEffect(() => {
    const newCode = defaultCode[language];
    setCode(newCode);
  }, [language, defaultCode, setCode]);

  return (
    <ResizablePanel id={"code-panel"} defaultSize={70}>
      <PanelWrapper className={"rounded-none border-0 dark:bg-[#1e1e1e]"}>
        <Editor
          value={code}
          onChange={(e) => setCode(e as string)}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: Number(settings.fontSize),
            tabSize: Number(settings.tabSize),
            readOnly: isPending,
            fontLigatures: true,
            wordWrap: "on",
            bracketPairColorization: {
              enabled: true,
            },
            formatOnPaste: true,
          }}
          language={language}
        />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default CodePanel;
