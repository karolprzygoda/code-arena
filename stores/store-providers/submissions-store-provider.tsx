"use client";

import { PropsWithChildren, useRef } from "react";
import {
  createSubmissionsStore,
  SubmissionsContext,
  SubmissionsProps,
  SubmissionsStore,
} from "@/stores/submissions-store";

type SubmissionsProviderProps = PropsWithChildren<SubmissionsProps>;

const EditorStoreProvider = ({
  children,
  ...props
}: SubmissionsProviderProps) => {
  const storeRef = useRef<SubmissionsStore>();
  if (!storeRef.current) {
    storeRef.current = createSubmissionsStore(props);
  }

  return (
    <SubmissionsContext.Provider value={storeRef.current}>
      {children}
    </SubmissionsContext.Provider>
  );
};

export default EditorStoreProvider;
