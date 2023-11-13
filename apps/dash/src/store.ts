import { create } from "zustand";
import { RouterOutputs } from "./utils/trpc";

type Org = RouterOutputs["org"]["lookup"];

type AppStore = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  org: Org | null;
  setOrg: (org: Org) => void;
};

export const useStore = create<AppStore>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (val) => set(() => ({ isLoggedIn: val })),
  org: null,
  setOrg: (org) => set(() => ({ org })),
}));
