"use client";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user: user }),
  clearUser: () => set({ user: null }),
}));
