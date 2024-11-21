"use client";

import PanelHeader from "@/components/dashboard/panels/panel-header";
import { Editor } from "@monaco-editor/react";
import { ResizablePanel } from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import PanelWrapper from "@/components/dashboard/panels/panel-wrapper";
import SwitchLayoutButton from "@/components/dashboard/buttons/switch-layout-button";
import MaximizeEditorButton from "@/components/dashboard/buttons/maximize-editor-button";
import ShortcutButton from "@/components/dashboard/buttons/shortcut-button";
import CodeResetButton from "@/components/dashboard/buttons/code-reset-button";
import SettingsButton from "@/components/dashboard/buttons/settings-button";
import { useEditorStore } from "@/lib/editorStore";
import { useShallow } from "zustand/react/shallow";
import ChooseLanguageButton from "@/components/dashboard/buttons/choose-language-button";
import { useStore } from "zustand";

const CodePanel = () => {
  const { resolvedTheme } = useTheme();
  const { value, defaultValue, defaultLanguage, setValue, settings } = useStore(
    useEditorStore,
    useShallow((state) => ({
      value: state.value,
      defaultValue: state.defaultValue,
      defaultLanguage: state.defaultLanguage,
      setValue: state.setValue,
      settings: state.settings,
    })),
  );

  return (
    <ResizablePanel defaultSize={75}>
      <PanelWrapper className={"rounded-none border-0 dark:bg-[#1e1e1e]"}>
        <PanelHeader className={"justify-end gap-4 px-3"}>
          <ChooseLanguageButton />
          <CodeResetButton />
          <ShortcutButton />
          <SettingsButton />
          <SwitchLayoutButton />
          <MaximizeEditorButton />
        </PanelHeader>
        <Editor
          value={value}
          onChange={(e) => setValue(e as string)}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: Number(settings.fontSize),
            tabSize: Number(settings.tabSize),
          }}
          defaultLanguage={defaultLanguage.toLocaleLowerCase()}
          language={defaultLanguage.toLocaleLowerCase()}
          defaultValue={defaultValue}
        />
      </PanelWrapper>
    </ResizablePanel>
  );
};

export default CodePanel;
