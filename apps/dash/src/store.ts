import { create } from "zustand";
import { RouterOutputs } from "./utils/trpc";

type Org = RouterOutputs["org"]["lookup"];
type User = RouterOutputs["auth"]["whoAmI"];

type AppStore = {
  user: User | null;
  setUser: (user: User) => void;
  org: Org | null;
  setOrg: (org: Org) => void;
  mobileSideBarVisible: boolean;
  setMobileSideBarVisible: (v?: boolean) => void;
};

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  org: null,
  setOrg: (org) => set(() => ({ org })),
  mobileSideBarVisible: false,
  setMobileSideBarVisible: (v) =>
    set((s) => ({
      mobileSideBarVisible:
        typeof v === "boolean" ? v : !s.mobileSideBarVisible,
    })),
}));
