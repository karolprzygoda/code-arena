"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  Settings,
  SquareSlash,
  Swords,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function ChallangePage() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 1024 ? "vertical" : "horizontal");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResizablePanelGroup
      direction={direction}
      className="flex flex-1 px-4 pb-4"
    >
      <ResizablePanel minSize={25} maxSize={65} defaultSize={50}>
        <div
          className={
            "h-full w-full overflow-hidden rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          }
        >
          <div className={"flex h-full w-full flex-col"}>
            <div
              className={
                "flex h-[44px] items-center gap-1 border-b border-zinc-300 p-1 dark:border-zinc-700"
              }
            >
              <Button
                className={
                  "flex-1 justify-start rounded-tl-xl bg-transparent font-semibold text-accent-foreground shadow-none hover:bg-accent dark:hover:bg-zinc-900"
                }
              >
                <Swords />
                <span
                  className={"overflow-hidden text-ellipsis whitespace-nowrap"}
                >
                  Challenges Group Name
                </span>
              </Button>
              <Button
                className={
                  "bg-transparent px-3 font-semibold text-accent-foreground shadow-none hover:bg-accent dark:hover:bg-zinc-900"
                }
              >
                <ChevronLeft className={"h-4 w-4"} />
              </Button>
              <Button
                className={
                  "bg-transparent px-3 font-semibold text-accent-foreground shadow-none hover:bg-accent dark:hover:bg-zinc-900"
                }
              >
                <ChevronRight className={"h-4 w-4"} />
              </Button>
            </div>
            <Tabs defaultValue="account" className={"h-full"}>
              <TabsList
                className={
                  "grid h-auto w-full grid-cols-2 gap-1 rounded-b-none border-b border-zinc-300 py-2 outline-0 dark:border-zinc-700 sm:grid-cols-4"
                }
              >
                <TabsTrigger
                  className={
                    "px-4 py-1.5 font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
                  }
                  value="account"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  className={
                    "px-4 py-1.5 font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
                  }
                  value="password"
                >
                  Solutions
                </TabsTrigger>
                <TabsTrigger
                  className={
                    "px-4 py-1.5 font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
                  }
                  value="submissions"
                >
                  Submissions
                </TabsTrigger>
                <TabsTrigger
                  className={
                    "px-4 py-1.5 font-semibold hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700"
                  }
                  value="assistant"
                >
                  AI Assistant
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="account"
                className={
                  "h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"
                }
              >
                Challange Description
              </TabsContent>
              <TabsContent
                value="password"
                className={
                  "h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"
                }
              >
                Solutions
              </TabsContent>
              <TabsContent
                value="submissions"
                className={
                  "h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"
                }
              >
                Your Submissions
              </TabsContent>
              <TabsContent
                value="assistant"
                className={
                  "h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"
                }
              >
                AI Assistant
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className={"group bg-background p-2"} withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup
          direction="vertical"
          className={
            "rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          }
        >
          <ResizablePanel defaultSize={75}>
            <div className={"h-full w-full overflow-hidden"}>
              <div className={"flex h-full w-full flex-col"}>
                <div
                  className={
                    "flex h-[44px] min-h-[44px] items-center justify-end gap-4 border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]"
                  }
                >
                  <button>
                    <RotateCcw
                      className={
                        "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                      }
                    />
                  </button>
                  <button>
                    <SquareSlash
                      className={
                        "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                      }
                    />
                  </button>
                  <button>
                    <Settings
                      className={
                        "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                      }
                    />
                  </button>
                  <button>
                    <ArrowRightLeft
                      className={
                        "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                      }
                    />
                  </button>
                  <button>
                    <Maximize2
                      className={
                        "h-5 w-5 stroke-zinc-500 stroke-1 hover:stroke-zinc-400"
                      }
                    />
                  </button>
                </div>
                <div className={"h-full w-full"}>
                  <Editor
                    height="100%"
                    theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                    }}
                    width={"100%"}
                    defaultLanguage="typescript"
                    defaultValue={"export default function solution(){" + "}"}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle
            className={
              "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
            }
            withHandle
          />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6 dark:bg-[#1e1e1e]">
              <span className="font-semibold">Tests</span>
            </div>
          </ResizablePanel>
          <div
            className={
              "sticky bottom-0 flex items-center justify-between border-t border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-[#1e1e1e]"
            }
          >
            <div className={"flex items-center gap-4"}></div>
            <div className={"flex items-center justify-between gap-4"}>
              <Button className={"rounded-xl font-bold"}>Submit</Button>
            </div>
          </div>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
