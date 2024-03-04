import { permissionProcedure, router } from "../trpc";
import { UserPermissions } from "@zigbolt/shared";
import { paginationSchema } from "../utils/schemas";
import { Prisma } from "@zigbolt/prisma";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const driversRouter = router({
  list: permissionProcedure([UserPermissions["DRIVER:READ"]])
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.DriverWhereInput = {};

      if (input.search) {
        const searchColumns: Array<keyof Prisma.DriverWhereInput> = ["name"];

        where.OR = searchColumns.map((column) => ({
          [column]: {
            contains: input.search,
            mode: "insensitive",
          },
        }));
      }

      const [drivers, total] = await Promise.all([
        ctx.prisma.driver.findMany({
          where,
          take: input.take,
          skip: (input.page - 1) * input.take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.prisma.driver.count({ where }),
      ]);

      return { drivers, total };
    }),
  getById: permissionProcedure([UserPermissions["DRIVER:READ"]])
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const driver = await ctx.prisma.driver.findUnique({
        where: { id: input.id },
        include: { IdToken: true },
      });

      if (!driver) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return { driver };
    }),
  create: permissionProcedure()
    .input(z.object({ name: z.string().trim() }))
    .mutation(async ({ input, ctx }) => {
      const driver = await ctx.prisma.driver.create({
        data: { name: input.name },
      });

      return { driver };
    }),
});
