import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@zigbolt/prisma";
import { permissionProcedure, router } from "../trpc";
import { UserPermissions } from "@zigbolt/shared";
import { paginationSchema } from "../utils/schemas";

export const membersRouter = router({
  list: permissionProcedure([UserPermissions["MEMBER:READ"]])
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.UserWhereInput = {};

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const [members, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          include: { Role: true },
          take: input.take,
          skip: (input.page - 1) * input.take,
          orderBy: {
            name: "asc",
          },
        }),
        ctx.prisma.user.count({ where }),
      ]);

      return { members, total };
    }),
  invite: permissionProcedure([UserPermissions["MEMBER:ADD"]])
    .input(
      z.object({
        name: z.string().trim().optional(),
        email: z.string().toLowerCase().email(),
        role: z.union([
          z.literal("owner"),
          z.object({ id: z.string().uuid() }),
        ]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.role === "owner") {
        if (ctx.session.User.roleType !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Must be an owner to invite another owner",
          });
        }
      } else {
        const role = await ctx.prisma.role.findUnique({
          where: { id: input.role.id },
        });

        if (!role) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invalid role" });
        }
      }

      const user = await ctx.prisma.user.upsert({
        where: { email: input.email },
        update: {
          roleType: input.role === "owner" ? "owner" : "custom",
          roleId: input.role === "owner" ? null : input.role.id,
        },
        create: {
          email: input.email,
          name: input.name ?? input.email.split("@")[0],
          SensitiveInfo: {
            create: {},
          },
        },
        include: { Role: true },
      });

      return { user };
    }),
  changeRole: permissionProcedure([UserPermissions["MEMBER:CHANGE-ROLE"]])
    .input(
      z.object({
        userId: z.string().uuid(),
        newRole: z.union([
          z.literal("owner"),
          z.object({ id: z.string().uuid() }),
        ]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (input.newRole === "owner") {
        if (ctx.session.User.roleType !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Must be an owner to invite another owner",
          });
        }
      } else {
        const role = await ctx.prisma.role.findUnique({
          where: { id: input.newRole.id },
        });

        if (!role) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invalid role" });
        }
      }

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          roleType: input.newRole === "owner" ? "owner" : "custom",
          roleId: input.newRole === "owner" ? null : input.newRole.id,
        },
      });
    }),
  remove: permissionProcedure([UserPermissions["MEMBER:REMOVE"]])
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        // Assume already removed
        return null;
      }

      if (user.roleType === "owner") {
        if (ctx.session.User.roleType !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Must be an owner to remove another owner",
          });
        }
      }

      // Remove!
      await ctx.prisma.user.delete({
        where: { id: user.id },
      });
    }),
});
