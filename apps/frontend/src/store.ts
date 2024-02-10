import { useMemo } from "react";
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
export function usePermissions(): UserPermissions[] {
  const membership = useStore(
    (s) => s.user?.Memberships.find((m) => m.orgId === s.org?.id),
  );

  const permissions = useMemo<UserPermissions[]>(() => {
    if (membership?.roleType === "owner") {
      // Owners have all the permissions
      return AllPermissions;
    }

    // Parse and return
    const perms = permissionSchema.safeParse(membership?.Role?.permissions);

    // Check if success or failure
    return perms.success ? perms.data : [];
  }, [membership?.Role?.permissions, membership?.roleType]);

  return permissions;
}
