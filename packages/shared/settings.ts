import { type SettingsKeyEnum } from "@zigbolt/prisma";

export type KeyDescription = {
  key: SettingsKeyEnum;
  name: string;
  description?: string;
};

export const SettingsKeyDetails: Record<SettingsKeyEnum, KeyDescription> = {
  name: {
    key: "name",
    name: "Server name",
  },
  logoB64: {
    key: "logoB64",
    name: "Server logo",
  },
};
