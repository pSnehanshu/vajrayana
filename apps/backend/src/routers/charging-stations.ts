import { ArrayElement, UserPermissions } from "@zigbolt/shared";
import { permissionProcedure, router } from "../trpc";
import { z } from "zod";
import { paginationSchema } from "../utils/schemas";
import { Prisma } from "@zigbolt/prisma";
import { TRPCError } from "@trpc/server";

export const chargingStationsRouter = router({
  list: permissionProcedure([UserPermissions["CS:READ"]])
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.ChargingStationWhereInput = {};

      if (input.search) {
        const searchColumns: Array<keyof Prisma.ChargingStationWhereInput> = [
          "friendlyName",
          "model",
          "serialNumber",
          "modem_iccid",
          "modem_imsi",
          "urlName",
          "vendorName",
        ];

        where.OR = searchColumns.map((column) => ({
          [column]: {
            contains: input.search,
            mode: "insensitive",
          },
        }));
      }

      const [chargingStations, total] = await Promise.all([
        ctx.prisma.chargingStation.findMany({
          where,
          take: input.take,
          skip: (input.page - 1) * input.take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.prisma.chargingStation.count({ where }),
      ]);

      const CSMap = new Map<string, ArrayElement<typeof chargingStations>>();
      chargingStations.forEach((cs) => CSMap.set(cs.id, cs));

      return { stations: CSMap, total };
    }),
  getById: permissionProcedure([UserPermissions["CS:READ"]])
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Fetch cs
      const cs = await ctx.prisma.chargingStation.findUnique({
        where: { id: input.id },
        include: { EVSEs: true },
      });

      if (!cs) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Charging station not found",
        });
      }

      return cs;
    }),
});
