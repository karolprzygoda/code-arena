import { useContext } from "react";
import { useStore } from "zustand";
import {
  SubmissionsContext,
  SubmissionsState,
} from "@/stores/submissions-store";

const useSubmissionsContext = <T>(
  selector: (action: SubmissionsState) => T,
): T => {
  const store = useContext(SubmissionsContext);
  if (!store)
    throw new Error("Missing SubmissionsContext.Provider in the tree");

  return useStore(store, selector);
};

export default useSubmissionsContext;
