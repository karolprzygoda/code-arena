import { ResizableHandle } from "@/components/ui/resizable";

const EditorResizableHandle = () => {
  return (
    <ResizableHandle
      className={
        "group border-y border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 lg:[&[data-panel-group-direction=vertical]>div]:rotate-90"
      }
      withCustomHandle
    />
  );
};

export default EditorResizableHandle;
