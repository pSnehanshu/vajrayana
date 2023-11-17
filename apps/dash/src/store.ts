import { create } from "zustand";
import { RouterOutputs } from "./utils/trpc";
import {
  AllPermissions,
  UserPermissions,
  permissionSchema,
} from "@zigbolt/shared";

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

/** Get all the permissions this user has on this org */
export const usePermissions = (): UserPermissions[] => {
  return useStore((s) => {
    const membership = s.user?.Memberships.find((m) => m.orgId === s.org?.id);
    if (!membership) return [];

    if (membership.roleType === "owner") {
      // Owners have all the permissions
      return AllPermissions;
    }

    const perms = permissionSchema.safeParse(membership.Role?.permissions);

    return perms.success ? perms.data : [];
  });
};
