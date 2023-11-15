import { Prisma } from "@zigbolt/prisma";
import { UserPermissions } from "@zigbolt/shared";
import { orgProcedure, router } from "../trpc";
import { paginationSchema } from "../utils/schemas";

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

      return { roles, total };
    }),
});
