import EditorWrapper from "@/app/(root)/challange/[challangeName]/@editor/_components/editor-wrapper";
import PanelHeader from "@/app/(root)/challange/_components/panel-header";
import ChooseLanguageButton from "@/app/(root)/challange/_components/buttons/choose-language-button";
import CodeResetButton from "@/app/(root)/challange/_components/buttons/code-reset-button";
import ShortcutButton from "@/app/(root)/challange/_components/buttons/shortcut-button";
import SettingsButton from "@/app/(root)/challange/_components/buttons/settings-button";
import SwitchLayoutButton from "@/app/(root)/challange/_components/buttons/switch-layout-button";
import MaximizeEditorButton from "@/app/(root)/challange/_components/buttons/maximize-editor-button";
import MobileEditorSettings from "@/app/(root)/challange/[challangeName]/@editor/_components/mobile-editor-settings";
import CodePanel from "@/app/(root)/challange/[challangeName]/@editor/_components/code-panel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TestsPanel from "@/app/(root)/challange/[challangeName]/@editor/_components/tests-panel";
import PanelFooter from "@/app/(root)/challange/_components/panel-footer";
import ChallangeSubmitButton from "@/app/(root)/challange/_components/buttons/challange-submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EditorPage = () => {
  const tests = [
    { id: 1, input: [1, 2], expectedOutput: 3 },
    { id: 2, input: [1, 4], expectedOutput: 5 },
    { id: 3, input: [1, 6], expectedOutput: 7 },
  ];

  return (
    <EditorWrapper>
      <ResizablePanelGroup className={"rounded-2xl"} direction="vertical">
        <PanelHeader className={"justify-between px-3 dark:bg-[#1e1e1e]"}>
          <ChooseLanguageButton />
          <div className={"hidden gap-4 sm:flex"}>
            <CodeResetButton />
            <ShortcutButton />
            <SettingsButton />
            <SwitchLayoutButton />
            <MaximizeEditorButton />
          </div>
          <MobileEditorSettings />
        </PanelHeader>
        <CodePanel />
        <ResizableHandle
          className={
            "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
          }
          withHandle
        />
        <TestsPanel>
          <Accordion
            className={"border border-b-0 dark:border-zinc-700"}
            type="single"
            collapsible
          >
            {tests.map((test) => (
              <AccordionItem
                className={"h-auto dark:border-zinc-700"}
                key={`test-${test.id}`}
                value={`test-${test.id}`}
              >
                <AccordionTrigger className={"px-5 font-semibold"}>
                  {`Test ${test.id}`}
                </AccordionTrigger>
                <AccordionContent
                  className={"h-40 border-t p-0 dark:border-zinc-700"}
                >
                  <Tabs
                    defaultValue="account"
                    orientation={"vertical"}
                    className="flex h-full w-full p-0"
                  >
                    <TabsList
                      className={
                        "flex h-full flex-col items-start justify-start bg-transparent p-0"
                      }
                    >
                      <TabsTrigger
                        className={
                          "h-10 w-32 justify-start rounded-none border-b border-r bg-transparent data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
                        }
                        value="account"
                      >
                        Input
                      </TabsTrigger>
                      <TabsTrigger
                        className={
                          "h-10 w-32 justify-start rounded-none border-b border-r bg-transparent data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
                        }
                        value="3"
                      >
                        Return Value
                      </TabsTrigger>
                      <TabsTrigger
                        className={
                          "h-10 w-32 justify-start rounded-none border-b border-r bg-transparent data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
                        }
                        value="4"
                      >
                        Console Output
                      </TabsTrigger>
                      <TabsTrigger
                        className={
                          "h-10 w-32 justify-start rounded-none border-r bg-transparent data-[state=active]:border-r-0 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none dark:border-zinc-700"
                        }
                        value="5"
                      >
                        Error Output
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      className={"overflow-y-auto p-4"}
                      value="account"
                    >
                      Make changes to your account here. Make changes to your
                      account here. Make changes to your account here. Make
                      changes to your account here. Make changes to your account
                      here. Make changes to your account here. Make changes to
                      your account here. Make changes to your account here. Make
                      changes to your account here.
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TestsPanel>
        <PanelFooter>
          <div className={"flex items-center gap-4"}></div>
          <div className={"flex items-center justify-between gap-4"}>
            <ChallangeSubmitButton />
          </div>
        </PanelFooter>
      </ResizablePanelGroup>
    </EditorWrapper>
  );
};

export default EditorPage;
