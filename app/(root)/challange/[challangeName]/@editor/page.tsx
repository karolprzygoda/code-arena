import EditorWrapper from "@/app/(root)/challange/[challangeName]/@editor/_components/editor-wrapper";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import ChooseLanguageButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/choose-language-button";
import CodeResetButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/code-reset-button";
import ShortcutButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/shortcut-button";
import SettingsButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/settings-button";
import SwitchLayoutButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/switch-layout-button";
import MaximizeEditorButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/maximize-editor-button";
import MobileEditorSettings from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/mobile-editor-settings";
import CodePanel from "@/app/(root)/challange/[challangeName]/@editor/_components/code-panel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TestsPanel from "@/app/(root)/challange/[challangeName]/@editor/_components/tests-panel";
import PanelFooter from "@/app/(root)/challange/_components/panel-footer";
import ChallangeSubmitButton from "@/app/(root)/challange/[challangeName]/@editor/_components/buttons/challange-submit-button";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";

type EditorPageParams = {
  params: Promise<{ challangeName: string }>;
};

const mapType = (value: unknown) => {
  const jsType = typeof value;
  switch (jsType) {
    case "number":
      return "int";
    case "string":
      return "String";
    case "boolean":
      return "boolean";
    default:
      return "Object";
  }
};

const EditorPage = async ({ params }: EditorPageParams) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challangeName,
    },
    select: {
      testCases: true,
      id: true,
    },
  });

  if (data === null) {
    notFound();
  }

  const defaultCode = {
    javascript: `function solution(${data.testCases
      .at(0)!
      .inputs.map((input) => input.name)
      .join(",")}) {\n    // Write your code here\n}`,
    python: `def solution(${data.testCases
      .at(0)!
      .inputs.map((input) => input.name)
      .join(",")}):\n    # Write your code here\n    pass`,
    java: `public class Solution {\n    public static void solution(${data.testCases
      .at(0)!
      .inputs.map((input) => `${mapType(input.value)} ${input.name}`)
      .join(", ")}) {\n        // Write your code here\n    }\n}`,
  };

  return (
    <EditorWrapper>
      <ResizablePanelGroup
        autoSaveId="persistence"
        className={"rounded-2xl"}
        direction="vertical"
      >
        <PanelHeader className={"justify-between px-3 dark:bg-[#1e1e1e]"}>
          <ChooseLanguageButton />
          <div className={"hidden gap-4 sm:flex"}>
            <CodeResetButton defaultCode={defaultCode} />
            <ShortcutButton />
            <SettingsButton />
            <SwitchLayoutButton />
            <MaximizeEditorButton />
          </div>
          <MobileEditorSettings defaultCode={defaultCode} />
        </PanelHeader>
        <CodePanel defaultCode={defaultCode} />
        <ResizableHandle
          className={
            "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
          }
          withCustomHandle
        />
        <TestsPanel tests={data.testCases} />
        <PanelFooter>
          <div className={"flex items-center gap-4"}></div>
          <div className={"flex items-center justify-between gap-4"}>
            <ChallangeSubmitButton
              defaultCode={defaultCode}
              challengeId={data.id}
            />
          </div>
        </PanelFooter>
      </ResizablePanelGroup>
    </EditorWrapper>
  );
};

export default EditorPage;
