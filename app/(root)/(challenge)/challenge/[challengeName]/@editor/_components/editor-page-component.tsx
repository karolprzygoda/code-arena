import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import EditorStoreProvider from "@/stores/store-providers/editor-store-provider";
import CodeEditorWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-wrapper";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import LanguageDropdown from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/language-dropdown";
import CodeEditorToolbar from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-toolbar";
import CodeEditorPanel from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-panel";
import TestsPanel from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tests-panel";
import PanelFooter from "@/app/(root)/(challenge)/_components/panel-footer";
import SubmitChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/submit-challenge-button";
import ExpandTestsPanelButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/expand-tests-panel-button";

type EditorPageComponentProps = {
  challengeName: string;
};

const EditorPageComponent = async ({
  challengeName,
}: EditorPageComponentProps) => {
  const data = await prismadb.challenge.findFirst({
    where: {
      title: challengeName,
    },
    select: {
      testCases: true,
      id: true,
      title: true,
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
  };

  const sanitizedHiddenTests = data.testCases
    .map((testCase) =>
      testCase.hidden
        ? {
            inputs: null as unknown as PrismaJson.InputType[],
            expectedOutput: null,
            hidden: testCase.hidden,
          }
        : testCase,
    )
    .sort((a, b) => {
      if (a.hidden === b.hidden) return 0;
      return a.hidden ? 1 : -1;
    });

  return (
    <EditorStoreProvider
      code={defaultCode}
      language={"javascript"}
      isPending={false}
      storageName={`${challengeName}-challenge-store`}
    >
      <CodeEditorWrapper>
        <ResizablePanelGroup autoSaveId="persistence" direction="vertical">
          <PanelHeader>
            <LanguageDropdown />
            <CodeEditorToolbar defaultCode={defaultCode} />
          </PanelHeader>
          <CodeEditorPanel />
          <ResizableHandle
            className={
              "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
            }
            withCustomHandle
          />
          <TestsPanel tests={sanitizedHiddenTests} />
          <PanelFooter>
            <ExpandTestsPanelButton />
            <SubmitChallengeButton
              defaultCode={defaultCode}
              challengeId={data.id}
            />
          </PanelFooter>
        </ResizablePanelGroup>
      </CodeEditorWrapper>
    </EditorStoreProvider>
  );
};

export default EditorPageComponent;
