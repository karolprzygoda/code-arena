"use client";

import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";
import { useUserPreferencesStore } from "@/stores/user-preferences-store";
import useEditorContext from "@/hooks/use-editor-context";
import useSaveShortcut from "@/hooks/use-save-shortcut";
import { toast } from "sonner";

const CodeEditorPanel = () => {
  const { resolvedTheme } = useTheme();
  const { code, language, setCode, isPending, saveCode } = useEditorContext(
    useShallow((state) => ({
      code: state.code,
      language: state.language,
      setCode: state.setCode,
      isPending: state.isPending,
      saveCode: state.saveCode,
    })),
  );

  const { settings } = useUserPreferencesStore(
    useShallow((state) => ({
      settings: state.settings,
    })),
  );

  const handleSave = () => {
    saveCode();
    toast.success("Successfully saved code to local storage");
  };

  useSaveShortcut(handleSave);

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
          copyWithSyntaxHighlighting: true,
        }}
        language={language}
      />
    </ResizablePanel>
  );
};

export default CodeEditorPanel;
