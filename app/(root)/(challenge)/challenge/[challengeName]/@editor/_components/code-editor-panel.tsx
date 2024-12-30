"use client";

import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";
import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import useEditorContext from "@/hooks/use-editor-context";

const CodeEditorPanel = () => {
  const { resolvedTheme } = useTheme();
  const { code, language, setCode, isPending } = useEditorContext(
    useShallow((state) => ({
      code: state.code,
      language: state.language,
      setCode: state.setCode,
      isPending: state.isPending,
    })),
  );

  const { settings } = useUserPreferencesStore(
    useShallow((state) => ({
      settings: state.settings,
    })),
  );

  return (
    <ResizablePanel id={"code-panel"} defaultSize={70}>
      <Editor
        value={code[language]}
        onChange={(e) => setCode(language, e as string)}
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
    </ResizablePanel>
  );
};

export default CodeEditorPanel;
