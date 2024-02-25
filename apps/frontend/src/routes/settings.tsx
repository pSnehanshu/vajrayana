import { authGuard, permissionGuard } from "@/lib/guards";
import { createFileRoute } from "@tanstack/react-router";
import { UserPermissions } from "@zigbolt/shared";

export const Route = createFileRoute("/settings")({
  beforeLoad() {
    authGuard();
    permissionGuard(
      [UserPermissions["ORG:READ"], UserPermissions["ORG:UPDATE"]],
      "some",
    );
  },
});
