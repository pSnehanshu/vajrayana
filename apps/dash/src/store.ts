import { create } from "zustand";

type AppStore = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
};

export const useStore = create<AppStore>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (v) => set(() => ({ isLoggedIn: v })),
}));
