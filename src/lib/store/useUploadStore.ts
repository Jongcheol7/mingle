import { create } from "zustand";

type UploadStore = {
  saveFiles: File[];
  setSaveFiles: (files: File[]) => void;
  clearFiles: () => void;

  // ✅ 영상 자르기 범위 (초 단위)
  // trimRange: { start: number; end: number } | null;
  // setTrimRange: (range: { start: number; end: number }) => void;
  // clearTrimRange: () => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  saveFiles: [],
  setSaveFiles: (files) => set({ saveFiles: files }),
  clearFiles: () => set({ saveFiles: [] }),

  // trimRange: null,
  // setTrimRange: (range) => set({ trimRange: range }),
  // clearTrimRange: () => set({ trimRange: null }),
}));
