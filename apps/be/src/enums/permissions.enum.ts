/**
 * List of available permissions
 */
export enum Permissions {
  "ORG:READ" = 1,
  "ORG:UPDATE" = 2,
  "MEMBER:READ" = 3,
  "MEMBER:ADD" = 4,
  "MEMBER:REMOVE" = 5,
  "MEMBER:CHANGE-ROLE" = 6,
}

/** Array of all the permissions */
export const AllPermissions: Permissions[] = [];

Object.entries(Permissions).forEach(([_name, val]) => {
  if (typeof val !== "string") {
    AllPermissions.push(val);
  }
});
