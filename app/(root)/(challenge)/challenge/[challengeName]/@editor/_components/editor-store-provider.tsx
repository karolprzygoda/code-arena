"use client";

import { PropsWithChildren, useRef } from "react";
import {
  createEditorStore,
  EditorContext,
  EditorProps,
  EditorStore,
} from "@/stores/editor-store";

type EditorProviderProps = PropsWithChildren<
  EditorProps & { storageName: string }
>;

const EditorStoreProvider = ({
  children,
  storageName,
  ...props
}: EditorProviderProps) => {
  const storeRef = useRef<EditorStore>();
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
