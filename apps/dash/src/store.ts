import { create } from "zustand";

type AppStore = {
  isLoggedIn: boolean;
};

export const useStore = create<AppStore>((_set) => ({
  isLoggedIn: false,
}));
