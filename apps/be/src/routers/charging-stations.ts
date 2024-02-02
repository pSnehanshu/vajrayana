import { UserPermissions } from "@zigbolt/shared";
import { orgProcedure, permissionProcedure, router } from "../trpc";
import { z } from "zod";
import { paginationSchema } from "../utils/schemas";
import { Prisma } from "@zigbolt/prisma";

type ArrayElement<T> = T extends (infer U)[] ? U : never;

export const chargingStationsRouter = router({
  list: orgProcedure.input(paginationSchema).query(async ({ input, ctx }) => {
    const where: Prisma.ChargingStationWhereInput = {
      orgId: ctx.org.id,
    };

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
});
