import { z } from "zod";

/**
 * List of available permissions
 */
export enum UserPermissions {
  "ORG:READ" = 1,
  "ORG:UPDATE" = 2,
  "MEMBER:READ" = 3,
  "MEMBER:ADD" = 4,
  "MEMBER:REMOVE" = 5,
  "MEMBER:CHANGE-ROLE" = 6,
  "ROLE:READ" = 7,
  "ROLE:WRITE" = 8,
  "ROLE:DELETE" = 9,
}

/** Array of all the permissions */
export const AllPermissions: UserPermissions[] = [];

Object.entries(UserPermissions).forEach(([_name, val]) => {
  if (typeof val !== "string") {
    AllPermissions.push(val);
  }
});

export const permissionSchema = z.nativeEnum(UserPermissions).array();

export const PermissionDescriptions: Record<UserPermissions, string> = {
  [UserPermissions["ORG:READ"]]: "Can fetch organization details",
  [UserPermissions["ORG:UPDATE"]]: "Can update organization details",
  [UserPermissions["MEMBER:READ"]]: "Can fetch list of members",
  [UserPermissions["MEMBER:ADD"]]: "Can invite new members",
  [UserPermissions["MEMBER:REMOVE"]]: "Can remove existing members",
  [UserPermissions["MEMBER:CHANGE-ROLE"]]:
    "Can change role of existing members",
  [UserPermissions["ROLE:READ"]]: "Can fetch list of roles",
  [UserPermissions["ROLE:WRITE"]]: "Can edit role (add/remove permissions)",
  [UserPermissions["ROLE:DELETE"]]: "Can delete existing roles",
};
