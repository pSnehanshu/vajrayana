import { useAppStore } from "@/store";
import { redirect } from "@tanstack/react-router";
import { type UserPermissions } from "@zigbolt/shared";
import { getUserPermission } from "./permission";

/** Allow access to only logged in users. Meant to be used with `beforeLoad`. */
export function authGuard() {
  // If user isn't set in store, then redirect
  const { user } = useAppStore.getState();

  if (!user) {
    throw redirect({ to: "/login" });
  }
}

/** Allow access to users with sufficient permissions. Meant to be used with `beforeLoad`. */
export function permissionGuard(
  requiredPermissions: UserPermissions[],
  require: "every" | "some",
) {
  const { user } = useAppStore.getState();
  const permissions = getUserPermission(user);

  // Check if user has permissions
  const hasPermission = requiredPermissions[require]((p) =>
    permissions.includes(p),
  );

  if (!hasPermission) {
    throw Error("You do not have enough permission to access this page");
  }
}
