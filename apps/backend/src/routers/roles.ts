import { z } from "zod";
import _ from "lodash";
import { Prisma } from "@zigbolt/prisma";
import {
  ArrayElement,
  UserPermissions,
  permissionSchema,
} from "@zigbolt/shared";
import { permissionProcedure, router } from "../trpc";
import { paginationSchema } from "../utils/schemas";
import { TRPCError } from "@trpc/server";

export const rolesRouter = router({
  list: permissionProcedure([UserPermissions["ROLE:READ"]])
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.RoleWhereInput = {};

      if (input.search) {
        where.name = {
          contains: input.search,
          mode: "insensitive",
        };
      }

      const [roles, total] = await Promise.all([
        ctx.prisma.role.findMany({
          where,
          take: input.take,
          skip: (input.page - 1) * input.take,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.prisma.role.count({ where }),
      ]);

      const RoleMap = new Map<string, ArrayElement<typeof roles>>();
      roles.forEach((role) => RoleMap.set(role.id, role));

      return { roles: RoleMap, total };
    }),
  create: permissionProcedure([UserPermissions["ROLE:WRITE"]])
    .input(
      z.object({
        name: z.string().trim().min(1),
        permissions: permissionSchema.transform((v) => _.uniq(v)),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const role = await ctx.prisma.role.create({
        data: {
          name: input.name,
          permissions: input.permissions,
        },
      });

      return { role };
    }),
  update: permissionProcedure([UserPermissions["ROLE:WRITE"]])
    .input(
      z.object({
        roleId: z.string().uuid(),
        name: z.string().trim().min(1).optional(),
        permissions: permissionSchema.transform((v) => _.uniq(v)).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const role = await ctx.prisma.role.findUnique({
        where: { id: input.roleId },
      });

      if (!role) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Update
      const updatedRole = await ctx.prisma.role.update({
        where: { id: role.id },
        data: {
          name: input.name,
          permissions: input.permissions,
        },
      });

      return { role: updatedRole };
    }),
  delete: permissionProcedure([UserPermissions["ROLE:DELETE"]])
    .input(z.object({ roleId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const role = await ctx.prisma.role.findUnique({
        where: { id: input.roleId },
      });

      if (!role) {
        // Assume it was already deleted
        return null;
      }

      await ctx.prisma.role.delete({
        where: { id: input.roleId },
      });

      return null;
    }),
});
