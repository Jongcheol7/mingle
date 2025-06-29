import { create } from "zustand";

type UploadStore = {
  saveFiles: File[];
  setSaveFiles: (files: File[]) => void;
  clearFiles: () => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  saveFiles: [],
  setSaveFiles: (files) => set({ saveFiles: files }),
  clearFiles: () => set({ saveFiles: [] }),
}));
