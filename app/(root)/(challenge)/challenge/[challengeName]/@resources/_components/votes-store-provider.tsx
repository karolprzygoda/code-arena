"use client";

import { PropsWithChildren, useRef } from "react";
import {
  VotesProps,
  VotesStore,
  VotesContext,
  createVotesStore,
} from "@/stores/votes-store";

type VotesProviderProps = PropsWithChildren<VotesProps>;

const VotesStoreProvider = ({ children, ...props }: VotesProviderProps) => {
  const storeRef = useRef<VotesStore>();
  if (!storeRef.current) {
    storeRef.current = createVotesStore(props);
  }

  return (
    <VotesContext.Provider value={storeRef.current}>
      {children}
    </VotesContext.Provider>
  );
};

export default VotesStoreProvider;
