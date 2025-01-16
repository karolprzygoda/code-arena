"use client";

import { create } from "zustand";
import { createContext } from "react";

type SortOrder = "asc" | "desc";

export type FilteredDataProps<T extends Record<string, unknown>> = {
  initialData: T[];
  filters: Partial<Record<keyof T, unknown>>;
  defaultFilters?: Partial<Record<keyof T, unknown>>;
  sortKey?: keyof T;
  sortOrder?: SortOrder;
};

export type FilteredDataState<T extends Record<string, unknown>> = {
  data: T[];
  defaultFilters: Partial<Record<keyof T, unknown>>;
  clearFilters: () => void;
  setFilters: (filters: Partial<Record<keyof T, unknown>>) => void;
  setSort: (key: keyof T, order: SortOrder) => void;
} & FilteredDataProps<T>;

export type FilteredDataStore<T extends Record<string, unknown>> = ReturnType<
  typeof createFilteredDataStore<T>
>;

export const filterData = <T extends Record<string, unknown>>(
  initialData: T[],
  filters: Partial<Record<keyof T, unknown>>,
  defaultFilters: Partial<Record<keyof T, unknown>>,
): T[] => {
  return initialData.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      const itemKey = key as keyof T;
      const defaultValue = defaultFilters[itemKey];
      if (value === defaultValue || value === undefined) {
        return true;
      }
      return item[itemKey] === value;
    });
  });
};

export const createFilteredDataStore = <T extends Record<string, unknown>>(
  initState?: Partial<FilteredDataProps<T>>,
) => {
  const DEFAULT_STATE: FilteredDataProps<T> & {
    data: T[];
    defaultFilters: Partial<Record<keyof T, unknown>>;
  } = {
    initialData: [],
    filters: {},
    data: [],
    defaultFilters: {},
    sortKey: undefined,
    sortOrder: undefined,
  };

  return create<FilteredDataState<T>>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    defaultFilters: initState?.defaultFilters ?? initState?.filters ?? {},
    data:
      filterData(
        initState!.initialData!,
        initState!.filters!,
        initState!.defaultFilters ?? initState?.filters ?? {},
      ) ?? [],
    clearFilters: () => {
      set((state) => ({
        ...state,
        filters: {},
      }));
    },
    setFilters: (newFilters) => {
      set((state) => ({
        ...state,
        filters: { ...state.filters, ...newFilters },
      }));

      set((state) => ({
        ...state,
        data: filterData(
          state.initialData,
          state.filters,
          state.defaultFilters,
        ),
      }));
    },
    setSort: (key, order) => {
      set((state) => ({
        ...state,
        sortKey: key,
        sortOrder: order,
      }));

      set((state) => {
        const sortedData = [...state.data].sort((a, b) => {
          const aValue = a[key];
          const bValue = b[key];

          if (
            (typeof aValue === "number" && typeof bValue === "number") ||
            (aValue instanceof Date && bValue instanceof Date)
          ) {
            const a = aValue instanceof Date ? aValue.getTime() : aValue;
            const b = bValue instanceof Date ? bValue.getTime() : bValue;

            return order === "asc" ? a - b : b - a;
          }

          if (typeof aValue === "string" && typeof bValue === "string") {
            return order === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        });

        return {
          ...state,
          data: sortedData,
        };
      });
    },
  }));
};

export const FilteredDataContext = createContext<null | FilteredDataStore<
  Record<string, unknown>
>>(null);
