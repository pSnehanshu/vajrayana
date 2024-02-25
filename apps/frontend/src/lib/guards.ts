import { useAppStore } from "@/store";
import { redirect } from "@tanstack/react-router";
import { type UserPermissions } from "@zigbolt/shared";
import { getUserPermission } from "./permission";

/** Allow access to only logged in users. Meant to be used with `beforeLoad`. */
export function authGuard() {
  // If user isn't set in store, then redirect
  const { user, org } = useAppStore.getState();

  if (!user) {
    throw redirect({ to: "/login" });
  }

  // If user is set, ensure the user is member of the team
  const membership = user.Memberships.find((m) => m.orgId === org?.id);

  if (!membership) {
    throw new Error("User is not member of this org");
  }
}

/** Allow access to users with sufficient permissions. Meant to be used with `beforeLoad`. */
export function permissionGuard(
  requiredPermissions: UserPermissions[],
  require: "every" | "some",
) {
  const { user, org } = useAppStore.getState();
  const permissions = getUserPermission(user, org?.id ?? null);

  // Check if user has permissions
  const hasPermission = requiredPermissions[require]((p) =>
    permissions.includes(p),
  );

  if (!hasPermission) {
    throw Error("User does not have permission");
  }
}
