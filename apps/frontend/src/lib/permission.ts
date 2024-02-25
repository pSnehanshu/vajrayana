import { RouterOutputs } from "@/lib/trpc";
import { AllPermissions, permissionSchema } from "@zigbolt/shared";

/** Get a user's permission in a given org */
export function getUserPermission(
  user: RouterOutputs["auth"]["whoAmI"] | null,
  orgId: string | null,
) {
  const membership = user?.Memberships.find((m) => m.orgId === orgId);

  if (membership?.roleType === "owner") {
    // Owners have all the permissions
    return AllPermissions;
  }

  // Parse and return
  const _perms = permissionSchema.safeParse(membership?.Role?.permissions);
  return _perms.success ? _perms.data : [];
}
