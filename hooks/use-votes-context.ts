import { useContext } from "react";
import { useStore } from "zustand";
import { VotesContext, VotesState } from "@/stores/votes-store";

const useVotesContext = <T>(selector: (action: VotesState) => T): T => {
  const store = useContext(VotesContext);
  if (!store) throw new Error("Missing EditorContext.Provider in the tree");

  return useStore(store, selector);
};

export default useVotesContext;
