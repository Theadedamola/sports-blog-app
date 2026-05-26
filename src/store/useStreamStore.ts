import { create } from "zustand";

interface StreamState {
  streamUrl: string | null;
  isFullscreen: boolean;
  isLoading: boolean;
  error: string | null;
  setStream: (url: string | null) => void;
  toggleFullscreen: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  streamUrl: null,
  isFullscreen: false,
  isLoading: true,
  error: null,
  setStream: (url) => set({ streamUrl: url, isLoading: true, error: null }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
