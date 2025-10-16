import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import EditorStoreProvider from "@/stores/store-providers/editor-store-provider";
import CodeEditorWrapper from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-wrapper";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import PanelHeader from "@/app/(root)/(challenge)/_components/panel-header";
import LanguageDropdown from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/language-dropdown";
import CodeEditorToolbar from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-toolbar";
import CodeEditorPanel from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/code-editor-panel";
import TestsPanel from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/tests-panel";
import PanelFooter from "@/app/(root)/(challenge)/_components/panel-footer";
import SubmitChallengeButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/submit-challenge-button";
import ExpandTestsPanelButton from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/tests-components/expand-tests-panel-button";
import { sanitizeTestCases } from "@/lib/utils";
import EditorResizableHandle from "@/app/(root)/(challenge)/challenge/[challengeName]/@editor/_components/editor-resizable-handle";

type EditorPageComponentProps = {
  challengeName: string;
};

const EditorPageComponent = async ({
  challengeName,
}: EditorPageComponentProps) => {
  const challengeData = await prismadb.challenge.findFirst({
    where: {
      title: challengeName,
    },
    select: {
      testCases: true,
      id: true,
      title: true,
    },
  });

  if (challengeData === null) {
    notFound();
  }

  const defaultCode = {
    javascript: `function solution(${challengeData.testCases
      .at(0)!
      .inputs.map((input) => input.name)
      .join(",")}) {\n    // Write your code here\n}`,
    python: `def solution(${challengeData.testCases
      .at(0)!
      .inputs.map((input) => input.name)
      .join(",")}):\n    # Write your code here\n    pass`,
  };

  const sanitizedTests = sanitizeTestCases(challengeData.testCases);

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
          <EditorResizableHandle />
          <TestsPanel tests={sanitizedTests} />
          <PanelFooter>
            <ExpandTestsPanelButton />
            <SubmitChallengeButton
              defaultCode={defaultCode}
              challengeId={challengeData.id}
            />
          </PanelFooter>
        </ResizablePanelGroup>
      </CodeEditorWrapper>
    </EditorStoreProvider>
  );
};

export default EditorPageComponent;
