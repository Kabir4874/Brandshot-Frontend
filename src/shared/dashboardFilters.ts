// src/shared/dashboardFilters.ts
"use client";

import { create } from "zustand";

export type DateSort = "newest" | "oldest" | "7d" | "30d";

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.map(String);
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String);
      if (parsed && typeof parsed === "string") return [parsed];
    } catch {
      if (input.trim()) return [input.trim()];
    }
  }
  return ["All"];
}

type DashboardFiltersState = {
  query: string;
  tags: string[];
  availableTags: string[];
  dateSort: DateSort;
  setQuery: (q: string) => void;
  setTags: (next: string[] | ((prev: string[]) => string[])) => void;
  setDateSort: (d: DateSort) => void;
  setAvailableTags: (tags: string[]) => void;
};

export const useDashboardFilters = create<DashboardFiltersState>((set) => ({
  query: "",
  tags: ["All"],
  availableTags: [], // dynamically updated from projects
  dateSort: "newest",
  setQuery: (q) => set({ query: q }),
  setTags: (next) =>
    set((state) => {
      const prev = normalizeTags(state.tags);
      const value =
        typeof next === "function" ? (next as (p: string[]) => string[])(prev) : next;
      return { tags: normalizeTags(value) };
    }),
  setDateSort: (d) => set({ dateSort: d }),
  setAvailableTags: (tags) => set({ availableTags: [...new Set(tags)] }),
}));
