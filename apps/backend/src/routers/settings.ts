import { z } from "zod";
import { Prisma, SettingsKeyEnum } from "@zigbolt/prisma";
import { authProcedure, publicProcedure, router } from "../trpc";
import { ArrayElement } from "@zigbolt/shared";

const publicSettings = [SettingsKeyEnum.logoB64, SettingsKeyEnum.name] as const;

export const settingsRouter = router({
  get: authProcedure
    .input(
      z.object({
        keys: z.nativeEnum(SettingsKeyEnum).array().or(z.literal("all")),
      }),
    )
    .query(async ({ input, ctx }) => {
      const where: Prisma.SettingsWhereInput = {};

      if (input.keys !== "all") {
        where.key = { in: input.keys };
      }

      // Fetch the settings
      const settings = await ctx.prisma.settings.findMany({ where });

      const settingsMap = new Map<
        SettingsKeyEnum,
        ArrayElement<typeof settings>
      >();
      settings.forEach((setting) => settingsMap.set(setting.key, setting));

      return { settings: settingsMap };
    }),
  getPublic: publicProcedure
    .input(
      z.object({
        keys: z.enum(publicSettings).array().or(z.literal("all")),
      }),
    )
    .query(async ({ input, ctx }) => {
      const where: Prisma.SettingsWhereInput = {};

      if (input.keys === "all") {
        where.key = { in: publicSettings as unknown as SettingsKeyEnum[] };
      } else {
        where.key = { in: input.keys };
      }

      // Fetch the settings
      const settings = await ctx.prisma.settings.findMany({ where });

      const settingsMap = new Map<
        SettingsKeyEnum,
        ArrayElement<typeof settings>
      >();
      settings.forEach((setting) => settingsMap.set(setting.key, setting));

      return { settings: settingsMap };
    }),
  set: authProcedure
    .input(
      z.object({
        key: z.nativeEnum(SettingsKeyEnum),
        value: z.string().trim(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.settings.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: { key: input.key, value: input.value },
      });
    }),
});
