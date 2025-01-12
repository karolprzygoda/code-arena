"use client";

import { PropsWithChildren, useRef } from "react";
import {
  createMarkdownStore,
  MarkdownContext,
  MarkdownProps,
  MarkdownStore,
} from "@/stores/markdown-editor-store";

type MarkdownProviderProps = PropsWithChildren<MarkdownProps>;

const MarkdownStoreProvider = ({
  children,
  ...props
}: MarkdownProviderProps) => {
  const storeRef = useRef<MarkdownStore>();
  if (!storeRef.current) {
    storeRef.current = createMarkdownStore(props);
  }

  return (
    <MarkdownContext.Provider value={storeRef.current}>
      {children}
    </MarkdownContext.Provider>
  );
};

export default MarkdownStoreProvider;
