/**
 * List of available permissions
 */
export enum Permissions {
  "ORG:READ" = 1,
  "ORG:UPDATE",
  "MEMBER:ADD",
  "MEMBER:REMOVE",
  "MEMBER:CHANGE-ROLE",
}

/** Array of all the permissions */
export const AllPermissions: Permissions[] = [];

Object.entries(Permissions).forEach(([_name, val]) => {
  if (typeof val !== "string") {
    AllPermissions.push(val);
  }
});
