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
