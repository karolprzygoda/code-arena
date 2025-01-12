"use client";

import { create } from "zustand";
import { createContext } from "react";

export type FilteredDataProps<T extends Record<string, unknown>> = {
  initialData: T[];
  data: T[];
  defaultFilters: Partial<Record<keyof T, unknown>>;
  filters: Partial<Record<keyof T, unknown>>;
  sortKey?: keyof T;
  sortOrder?: "asc" | "desc";
};

export type FilteredDataState<T extends Record<string, unknown>> = {
  clearFilters: () => void;
  setFilters: (filters: Partial<Record<keyof T, unknown>>) => void;
  setSort: (key: keyof T, order: "asc" | "desc") => void;
} & FilteredDataProps<T>;

export type FilteredDataStore<T extends Record<string, unknown>> = ReturnType<
  typeof createFilteredDataStore<T>
>;

export const createFilteredDataStore = <T extends Record<string, unknown>>(
  initState?: Partial<FilteredDataProps<T>>,
) => {
  const DEFAULT_STATE: Partial<FilteredDataProps<T>> = {
    initialData: [],
    data: [],
    filters: {},
    defaultFilters: {},
    sortKey: undefined,
    sortOrder: undefined,
  };

  return create<FilteredDataState<T>>()((set) => ({
    ...(DEFAULT_STATE as FilteredDataProps<T>),
    ...initState,
    clearFilters: () => {
      set({ filters: {} });
    },
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      }));

      set((state) => ({
        data: state.initialData.filter((item) => {
          return Object.entries(state.filters).every(([key, value]) => {
            const itemKey = key as keyof T;
            const defaultValue = state.defaultFilters[itemKey];
            if (value === defaultValue || value === undefined) {
              return true;
            }
            return item[itemKey] === value;
          });
        }),
      }));
    },
    setSort: (key, order) => {
      set(() => ({
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

        return { data: sortedData };
      });
    },
  }));
};

export const FilteredDataContext = createContext<null | FilteredDataStore<
  Record<string, unknown>
>>(null);
