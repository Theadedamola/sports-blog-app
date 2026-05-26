import { create } from "zustand";
import type { Match } from "@/types/api";

interface MatchesState {
  matches: Match[];
  liveMatches: Match[];
  selectedCategory: string;
  isLoading: boolean;
  setMatches: (matches: Match[]) => void;
  setLiveMatches: (matches: Match[]) => void;
  setCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMatchesStore = create<MatchesState>((set) => ({
  matches: [],
  liveMatches: [],
  selectedCategory: "football",
  isLoading: false,
  setMatches: (matches) => set({ matches }),
  setLiveMatches: (matches) => set({ liveMatches: matches }),
  setCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
