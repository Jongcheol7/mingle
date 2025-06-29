import { create } from "zustand";

type UploadStore = {
  saveFile: File | null;
  setSaveFile: (file: File | null) => void;
  clearFile: () => void;
};

export const useUploadVideoStore = create<UploadStore>((set) => ({
  saveFile: null,
  setSaveFile: (file) => set({ saveFile: file }),
  clearFile: () => set({ saveFile: null }),
}));
