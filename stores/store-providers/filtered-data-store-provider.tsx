"use client";

import { PropsWithChildren, useRef } from "react";
import {
  createFilteredDataStore,
  FilteredDataContext,
  FilteredDataProps,
  FilteredDataStore,
} from "@/stores/filtered-data-store";

type FilteredDataStoreProviderProps<T extends Record<string, unknown>> =
  PropsWithChildren<FilteredDataProps<T>>;

export function FilteredDataStoreProvider<T extends Record<string, unknown>>({
  children,
  ...props
}: FilteredDataStoreProviderProps<T>) {
  const storeRef = useRef<FilteredDataStore<T>>();

  if (!storeRef.current) {
    storeRef.current = createFilteredDataStore<T>(props);
  }

  return (
    <FilteredDataContext.Provider
      value={storeRef.current as FilteredDataStore<Record<string, unknown>>}
    >
      {children}
    </FilteredDataContext.Provider>
  );
}

export default FilteredDataStoreProvider;
