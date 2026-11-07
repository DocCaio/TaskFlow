import { create } from "zustand";
import type { StatusFilter } from "./types";

interface TaskFilterState {
  status: StatusFilter;
  search: string;
  setStatus: (status: StatusFilter) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

export const useTaskFilterStore = create<TaskFilterState>()((set) => ({
  status: "ALL",
  search: "",
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  reset: () => set({ status: "ALL", search: "" }),
}));
