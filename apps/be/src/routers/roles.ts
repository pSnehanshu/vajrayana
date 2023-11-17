import { z } from "zod";
import { uniq } from "lodash-es";
import { Prisma } from "@zigbolt/prisma";
import { UserPermissions, permissionSchema } from "@zigbolt/shared";
import { orgProcedure, router } from "../trpc";
import { paginationSchema } from "../utils/schemas";

type ArrayElement<T> = T extends (infer U)[] ? U : never;

export const rolesRouter = router({
  list: orgProcedure([UserPermissions["ROLE:READ"]])
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.RoleWhereInput = { orgId: ctx.org.id };

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
  create: orgProcedure([UserPermissions["ROLE:WRITE"]])
    .input(
      z.object({
        name: z.string().trim().min(1),
        permissions: permissionSchema.transform((v) => uniq(v)),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const role = await ctx.prisma.role.create({
        data: {
          name: input.name,
          permissions: input.permissions,
          orgId: ctx.org.id,
        },
      });

      return { role };
    }),
});
