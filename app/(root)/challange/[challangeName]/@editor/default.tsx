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

const EditorPage = async ({ params }: EditorPageParams) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: (await params).challangeName,
    },
    select: {
      testCases: true,
      id: true,
      defaultCode: true,
    },
  });

  if (data === null) {
    notFound();
  }

  return (
    <EditorWrapper>
      <ResizablePanelGroup className={"rounded-2xl"} direction="vertical">
        <PanelHeader className={"justify-between px-3 dark:bg-[#1e1e1e]"}>
          <ChooseLanguageButton />
          <div className={"hidden gap-4 sm:flex"}>
            <CodeResetButton defaultCode={data.defaultCode} />
            <ShortcutButton />
            <SettingsButton />
            <SwitchLayoutButton />
            <MaximizeEditorButton />
          </div>
          <MobileEditorSettings defaultCode={data.defaultCode} />
        </PanelHeader>
        <CodePanel defaultCode={data.defaultCode} />
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
              defaultCode={data.defaultCode}
              challengeId={data.id}
            />
          </div>
        </PanelFooter>
      </ResizablePanelGroup>
    </EditorWrapper>
  );
};

export default EditorPage;
