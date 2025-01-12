import { useContext } from "react";
import { useStore } from "zustand";
import {
  FilteredDataContext,
  FilteredDataState,
  FilteredDataStore,
} from "@/stores/filtered-data-store";

export function useFilteredDataContext<T extends Record<string, unknown>, U>(
  selector: (state: FilteredDataState<T>) => U,
): U {
  const store = useContext(FilteredDataContext);
  if (!store) {
    throw new Error("Missing FilteredDataContext.Provider in the tree");
  }

  return useStore(store as unknown as FilteredDataStore<T>, selector);
}

export default useFilteredDataContext;
