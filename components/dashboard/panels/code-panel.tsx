"use client";

import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";
import { useEditorStore } from "@/stores/editor-store";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "zustand";
import { usePreferencesStore } from "@/stores/user-preferences-store";

const CodePanel = () => {
  const { resolvedTheme } = useTheme();
  const { value, defaultValue, language, setValue } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      defaultValue: state.defaultValue,
      language: state.language,
      setValue: state.setValue,
    })),
  );

  const { settings } = useStore(
    usePreferencesStore,
    useShallow((state) => ({
      settings: state.settings,
    })),
  );

  return (
    <ResizablePanel defaultSize={100}>
      <PanelWrapper className={"rounded-none border-0 dark:bg-[#1e1e1e]"}>
        <Editor
          value={value}
          onChange={(e) => setValue(e as string)}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: Number(settings.fontSize),
            tabSize: Number(settings.tabSize),
          }}
          language={language.toLocaleLowerCase()}
          defaultValue={defaultValue}
        />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default CodePanel;
