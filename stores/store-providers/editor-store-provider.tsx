"use client";

import { PropsWithChildren, useRef } from "react";
import {
  createEditorStore,
  EditorContext,
  CodeEditorProps,
  CodeEditorStore,
} from "@/stores/code-editor-store";

type EditorProviderProps = PropsWithChildren<
  CodeEditorProps & { storageName: string }
>;

const EditorStoreProvider = ({
  children,
  storageName,
  ...props
}: EditorProviderProps) => {
  const storeRef = useRef<CodeEditorStore>();
  if (!storeRef.current) {
    storeRef.current = createEditorStore(storageName, props);
  }

  return (
    <EditorContext.Provider value={storeRef.current}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorStoreProvider;
